// Fetchers for issue & pull request data and metrics

import { Fetcher } from "..";
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
  octokit: CustomOctokit
): Promise<IssueAndPRDataQueryResponse> => {
  return (await octokit.graphql.paginate(`
      query($cursor: String) {
        organization(login:"github"){
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
    `)) as IssueAndPRDataQueryResponse;
};

const getIssueAndPrData = async (
  octokit: CustomOctokit
): Promise<IssueAndPRData> => {
  const queryResult = await queryForIssuesAndPrs(octokit);
  const dataResult = {} as Record<string, { closedIssuesCount: number }>;
  queryResult.organization.repositories.edges.forEach((edge) => {
    dataResult[edge.node.name] = {
      closedIssuesCount: edge.node.closedIssues.totalCount,
    };
  });
  return dataResult;
};

export const addIssueAndPrData: Fetcher = async (result, octokit) => {
  const dataResult = await getIssueAndPrData(octokit);
  Object.keys(dataResult).forEach((repoName) => {
    const repo = result.repositories[repoName];
    if (repo) {
      repo.closedIssuesCount = dataResult[repoName].closedIssuesCount || 0;
    }
  });

  return result;
};
