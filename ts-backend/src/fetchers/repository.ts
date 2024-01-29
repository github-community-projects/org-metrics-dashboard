// Fetchers for repository data and metrics

import { Fetcher, RepositoryResult } from "..";

export const addRepositoriesToResult: Fetcher = async (
  result,
  octokit,
  config
) => {
  const repos = await octokit.paginate(octokit.repos.listForOrg, {
    org: config.organization,
    type: "public",
  });

  const filteredRepos = repos.filter(
    (repo) =>
      !(repo.archived && !config.includeArchived) ||
      !(repo.fork && !config.includeForks)
  );

  return {
    ...result,
    repositories: filteredRepos.reduce((acc, repo) => {
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
          licenseName: repo.license?.name || "No License",
          watchersCount: repo.watchers_count,
          issuesEnabled: repo.has_issues,
          stars: repo.stargazers_count,
        } as RepositoryResult,
      };
    }, {} as Record<string, RepositoryResult>),
  };
};
