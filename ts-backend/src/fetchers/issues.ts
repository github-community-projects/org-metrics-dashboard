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
