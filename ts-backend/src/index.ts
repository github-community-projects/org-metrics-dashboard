import 'dotenv/config'
import { Octokit } from '@octokit/rest'
/**
 * Creates a new octokit instance that is authenticated as the user
 * @param token personal access token
 * @returns Octokit authorized with the personal access token
 */
export const personalOctokit = (token: string) => {
  return new Octokit({
    auth: token,
  })
}

const octokit = personalOctokit(process.env.GRAPHQL_TOKEN || '')



interface Result {
  "orgInfo": {
    "login": string;
    "name"?: string;
    "description": string | null;
    "createdAt": string
    // "membersWithRoleCount": number;
    // "projectsCount": number;
    // "projectsV2Count": number;
    // "repositoriesCount": number;
    // "teamsCount": number;
  },
  "repositories": Record<string, RepositoryResult>
}

interface RepositoryResult {
  "repositoryName": string;
  "repoNameWithOwner": string;
  "projectsCount": number;
  "discussionsCount": number;
  "forksCount": number;
  "openIssuesCount": number;
  "closedIssuesCount": number;
  "openPullRequestsCount": number;
  "mergedPullRequestsCount": number;
  "licenseName": string;
  "watchersCount": number;
}

let result = {} as Result

const addOrganizationInfoToResult = async (result: Result, octokit: Octokit): Promise<Result> => {
  const organziation = await octokit.orgs.get({ org: 'github' })
  return {
    ...result,
    orgInfo: {
      login: organziation.data.login,
      name: organziation.data.name,
      description: organziation.data.description,
      createdAt: organziation.data.created_at,
    }
  }
}

const addRepositoriesToResult = async (result: Result, octokit: Octokit): Promise<Result> => {
  const repos = await octokit.paginate(octokit.repos.listForOrg, { org: 'github', type: 'public'})

  return {
    ...result,
    repositories: repos.reduce((acc, repo) => {
      return {
        ...acc,
        [repo.name]: {
          repositoryName: repo.name,
          repoNameWithOwner: repo.full_name,
          projectsCount: repo.has_projects ? 1 : 0,
          discussionsCount: repo.has_discussions ? 1 : 0,
          forksCount: repo.forks_count,
          openIssuesCount: repo.open_issues_count || 0,
          openPullRequestsCount: repo.open_issues_count,
          licenseName: repo.license?.name || 'No License',
          watchersCount: repo.watchers_count,
        } as RepositoryResult
      }
    }, {} as Record<string, RepositoryResult>)
  }
}

interface IssueAndPRDataQueryResponse {
  organization: {
    repositories: {
      totalCount: number;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      }
      edges: {
        node: {
          name: string;
          closedIssues: {
            totalCount: number;
          }
        }
      }[]
    }
  }
}

type IssueAndPRData = Record<string, { closedIssuesCount: number }>


const queryForIssuesAndPrs = async (octokit: Octokit, endCursor?: string): Promise<IssueAndPRDataQueryResponse> => {
  return await octokit.graphql({
    query: `
      query($endCursor: String) {
        organization(login:"github"){
          repositories(privacy:PUBLIC, first:100, isFork:false, isArchived:false, after: $endCursor) {
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
    endCursor,
  }) as IssueAndPRDataQueryResponse
}

const getIssueAndPrData = async (octokit: Octokit): Promise<IssueAndPRData> => {
  let queryResult = await queryForIssuesAndPrs(octokit)
  const dataResult = {} as Record<string, { closedIssuesCount: number }>
  queryResult.organization.repositories.edges.forEach((edge) => {
    dataResult[edge.node.name] = {
      closedIssuesCount: edge.node.closedIssues.totalCount
    }
  })
  let hasNextPage = queryResult.organization.repositories.pageInfo.hasNextPage
  while (hasNextPage) {
    queryResult = await queryForIssuesAndPrs(octokit, queryResult.organization.repositories.pageInfo.endCursor)
    queryResult.organization.repositories.edges.forEach((edge) => {
      dataResult[edge.node.name] = {
        closedIssuesCount: edge.node.closedIssues.totalCount
      }
    })
    hasNextPage = queryResult.organization.repositories.pageInfo.hasNextPage
  }
  return dataResult
}

const addIssueandPrData = async (result: Result, octokit: Octokit): Promise<Result> => {
  const dataResult = await getIssueAndPrData(octokit)
  Object.keys(dataResult).forEach((repoName) => {
    const repo = result.repositories[repoName]
    if (repo) {
      repo.closedIssuesCount = dataResult[repoName].closedIssuesCount || 0
    }
  })

  return result
}



result = await addOrganizationInfoToResult(result, octokit)
result = await addRepositoriesToResult(result, octokit)
result = await addIssueandPrData(result, octokit)
console.log(result)


