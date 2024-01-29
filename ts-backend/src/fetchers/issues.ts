// Fetchers for issue & pull request data and metrics

import { Config, Fetcher } from "..";
import { CustomOctokit } from "../lib/octokit";

interface IssueAndPRDataQueryResponse {
  organization: {
    repositories: {
      totalCount: number;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      edges: {
        node: {
          name: string;
          closedIssues: {
            totalCount: number;
          };
        };
      }[];
    };
  };
}

type IssueAndPRData = Record<string, { closedIssuesCount: number }>;

const queryForIssuesAndPrs = async (
  octokit: CustomOctokit,
  config: Config
): Promise<IssueAndPRDataQueryResponse> => {
  return (await octokit.graphql.paginate(
    `
      query($cursor: String, $organization: String!) {
        organization(login:$organization){
          repositories(privacy:PUBLIC, first:100, isFork:false, isArchived:false, after: $cursor) {
            totalCount
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                name
                closedIssues: issues(states:CLOSED) {
                  totalCount
                }
              }
            }
          }
        }
      }
    `,
    {
      organization: config.organization,
    }
  )) as IssueAndPRDataQueryResponse;
};

const getIssueAndPrData = async (
  octokit: CustomOctokit,
  config: Config
): Promise<IssueAndPRData> => {
  const queryResult = await queryForIssuesAndPrs(octokit, config);
  const dataResult = {} as Record<string, { closedIssuesCount: number }>;
  queryResult.organization.repositories.edges.forEach((edge) => {
    dataResult[edge.node.name] = {
      closedIssuesCount: edge.node.closedIssues.totalCount,
    };
  });
  return dataResult;
};

export const addIssueAndPrData: Fetcher = async (result, octokit, config) => {
  const dataResult = await getIssueAndPrData(octokit, config);
  Object.keys(dataResult).forEach((repoName) => {
    const repo = result.repositories[repoName];
    if (repo) {
      repo.closedIssuesCount = dataResult[repoName].closedIssuesCount || 0;
    }
  });

  return result;
};

const calculateIssueMetricsPerRepo = async (
  repoName: string,
  state: "open" | "closed",
  octokit: CustomOctokit,
  config: Config
) => {
  const result = await octokit.paginate(octokit.issues.listForRepo, {
    owner: config.organization,
    repo: repoName,
    state: state,
    // Need to limit this query somehow, otherwise it will take forever/timeout
    since: config.since,
  });

  // Calculate the total age of open issues
  const issues = result.filter((issue) => !issue.pull_request);
  const issuesCount = issues.length;
  const issuesTotalAge = issues.reduce((acc, issue) => {
    const createdAt = new Date(issue.created_at);
    const now = new Date();
    const age = now.getTime() - createdAt.getTime();
    return acc + age;
  }, 0);

  // Calculate the age of open issues
  const issuesAverageAge = issuesCount > 0 ? issuesTotalAge / issuesCount : 0;
  const issuesMedianAge =
    issues.length > 0
      ? new Date().getTime() -
        new Date(issues[Math.floor(issues.length / 2)].created_at).getTime()
      : 0;

  return {
    issuesCount,
    issuesAverageAge,
    issuesMedianAge,
  };
};

export const addIssueResponseTimeData: Fetcher = async (
  result,
  octokit,
  config
) => {
  for (const repoName of Object.keys(result.repositories)) {
    const {
      issuesCount: openIssuesCount,
      issuesAverageAge: openIssuesAverageAge,
      issuesMedianAge: openIssuesMedianAge,
    } = await calculateIssueMetricsPerRepo(repoName, "open", octokit, config);

    const {
      issuesCount: closedIssuesCount,
      issuesAverageAge: closedIssuesAverageAge,
      issuesMedianAge: closedIssuesMedianAge,
    } = await calculateIssueMetricsPerRepo(repoName, "closed", octokit, config);

    const repo = result.repositories[repoName];
    repo.openIssuesCount = openIssuesCount;
    repo.openIssuesAverageAge = openIssuesAverageAge;
    repo.openIssuesMedianAge = openIssuesMedianAge;
    repo.closedIssuesCount = closedIssuesCount;
    repo.closedIssuesAverageAge = closedIssuesAverageAge;
    repo.closedIssuesMedianAge = closedIssuesMedianAge;
  }
  return result;
};
