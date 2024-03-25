// Fetchers for issue & pull request data and metrics

import {
  IssueConnection,
  PageInfo,
  PullRequestConnection,
  Repository,
  RepositoryConnection,
} from '@octokit/graphql-schema';
import { Config, Fetcher } from '..';
import { CustomOctokit } from '../lib/octokit';

const getIssueAndPrData = async (octokit: CustomOctokit, config: Config) => {
  const issueData = await octokit.graphql.paginate<{
    organization: {
      repositories: {
        totalCount: RepositoryConnection['totalCount'];
        pageInfo: PageInfo;
        nodes: {
          name: Repository['name'];
          totalIssues: IssueConnection;
          openIssues: IssueConnection;
          closedIssues: IssueConnection;
          totalPullRequests: PullRequestConnection;
          openPullRequests: PullRequestConnection;
          closedPullRequests: PullRequestConnection;
          mergedPullRequests: PullRequestConnection;
        }[];
      };
    };
  }>(
    `
  query($cursor: String, $organization: String!) {
    organization(login:$organization){
      repositories(privacy:PUBLIC, first:100, isFork:false, isArchived:false, after: $cursor) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          totalIssues: issues {
            totalCount
          }
          closedIssues: issues(states:CLOSED) {
            totalCount
          }
          openIssues: issues(states:OPEN) {
            totalCount
          }
          openPullRequests: pullRequests(states:OPEN) {
            totalCount
          }
          totalPullRequests: pullRequests {
            totalCount
          }
          closedPullRequests: pullRequests(states:CLOSED) {
            totalCount
          }
          mergedPullRequests: pullRequests(states:MERGED) {
            totalCount
          }
        }
      }
    }
  }
`,
    {
      organization: config.organization,
    },
  );

  return issueData;
};

export const addIssueAndPrData: Fetcher = async (result, octokit, config) => {
  const dataResult = await getIssueAndPrData(octokit, config);
  dataResult.organization.repositories.nodes.forEach((repo) => {
    result.repositories[repo.name] = {
      ...result.repositories[repo.name],
      totalIssuesCount: repo.totalIssues.totalCount,
      openIssuesCount: repo.openIssues.totalCount,
      closedIssuesCount: repo.closedIssues.totalCount,
      totalPullRequestsCount: repo.totalPullRequests.totalCount,
      openPullRequestsCount: repo.openPullRequests.totalCount,
      closedPullRequestsCount: repo.closedPullRequests.totalCount,
      mergedPullRequestsCount: repo.mergedPullRequests.totalCount,
    };
  });

  return result;
};

const calculateIssueMetricsPerRepo = async (
  repoName: string,
  state: 'open' | 'closed',
  octokit: CustomOctokit,
  config: Config,
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

const calculateIssueResponseTime = async (
  repoName: string,
  octokit: CustomOctokit,
  config: Config,
) => {
  const result = await octokit.graphql.paginate<{ repository: Repository }>(
    `
    query ($cursor: String, $organization: String!, $repoName: String!, $since: DateTime!) {
      repository(owner: $organization, name:$repoName) {
        issues(first: 100, after: $cursor, filterBy: {since: $since}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            author {
              login
            }
            createdAt
            comments(first: 30) {
              totalCount
              nodes {
                createdAt
                author {
                  __typename
                  login
                  ... on Bot {
                    id
                  }
                }
                isMinimized
              }
            }
          }
        }
      }
    }
  `,
    {
      organization: config.organization,
      repoName: repoName,
      since: config.since,
    },
  );

  // Check if there are any issues at all
  if (
    !result.repository ||
    !result.repository.issues.nodes ||
    result.repository.issues.nodes?.length === 0
  ) {
    return {
      issuesCount: 0,
      issuesResponseAverageAge: 0,
      issuesResponseMedianAge: 0,
    };
  }

  // Filter out issues without comments that meet our criteria
  // Criteria:
  // - not the author of the issue
  // - the comment is not a bot
  // - the comment is not marked as spam
  //
  // Also filter out issues without comments after we filtered the comments
  const issues = result.repository.issues.nodes
    .map((issue) => {
      return {
        ...issue,
        comments: {
          nodes: issue!.comments.nodes?.filter(
            (comment) =>
              comment!.author?.login !== issue!.author?.login &&
              comment!.author?.__typename !== 'Bot' &&
              !comment?.isMinimized,
          ),
        },
      };
    })
    .filter((issue) => issue!.comments?.nodes?.length ?? 0 > 0);

  const issuesCount = issues.length;

  // Calculate the response time for each issue
  const issuesResponseTime = issues.map((issue) => {
    const createdAt = new Date(issue!.createdAt);
    const firstCommentAt = new Date(issue!.comments!.nodes?.[0]!.createdAt);
    return firstCommentAt.getTime() - createdAt.getTime();
  });

  // Sort them based on response time
  issuesResponseTime.sort((a, b) => a - b);

  // Calculate the average
  const issuesTotalResponseTime = issuesResponseTime.reduce(
    (acc, responseTime) => acc + responseTime,
    0,
  );
  const issuesResponseAverageAge =
    issuesCount > 0 ? issuesTotalResponseTime / issuesCount : 0;

  // Calculate the median
  const issuesResponseMedianAge =
    issues.length > 0 ? issuesResponseTime[Math.floor(issues.length / 2)] : 0;

  return {
    issuesCount,
    issuesResponseAverageAge,
    issuesResponseMedianAge,
  };
};

export const addIssueMetricsData: Fetcher = async (result, octokit, config) => {
  for (const repoName of Object.keys(result.repositories)) {
    const {
      issuesAverageAge: openIssuesAverageAge,
      issuesMedianAge: openIssuesMedianAge,
    } = await calculateIssueMetricsPerRepo(repoName, 'open', octokit, config);

    const {
      issuesAverageAge: closedIssuesAverageAge,
      issuesMedianAge: closedIssuesMedianAge,
    } = await calculateIssueMetricsPerRepo(repoName, 'closed', octokit, config);

    const { issuesResponseAverageAge, issuesResponseMedianAge } =
      await calculateIssueResponseTime(repoName, octokit, config);

    const repo = result.repositories[repoName];
    repo.openIssuesAverageAge = openIssuesAverageAge;
    repo.openIssuesMedianAge = openIssuesMedianAge;
    repo.closedIssuesAverageAge = closedIssuesAverageAge;
    repo.closedIssuesMedianAge = closedIssuesMedianAge;
    repo.issuesResponseAverageAge = issuesResponseAverageAge;
    repo.issuesResponseMedianAge = issuesResponseMedianAge;
  }

  return result;
};
