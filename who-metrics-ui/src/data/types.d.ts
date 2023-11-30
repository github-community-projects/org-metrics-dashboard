declare module "data.json" {
  interface RepoData {
    repoName: string;
    collaboratorsCount: number;
    projectsCount: number;
    discussionsCount: number;
    forksCount: number;
    issuesCount: number;
    openIssuesCount: number;
    closedIssuesCount: number;
    openPullRequestsCount: number;
    mergedPullRequestsCount: number;
    licenseName: string;
    watchersCount: number;
  }

  interface Data {
    [key: string]: RepoData;
  }

  const value: Data;
  export default value;
}
