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
          licenseName: repo.license?.name || "No License",
          forksCount: repo.forks_count,
          openIssuesCount: repo.open_issues_count || 0,
          openPullRequestsCount: repo.open_issues_count,
          watchersCount: repo.watchers_count,
          starsCount: repo.stargazers_count,
          issuesEnabled: repo.has_issues,
          projectsEnabled: repo.has_projects,
          discussionsEnabled: repo.has_discussions,
        } as RepositoryResult,
      };
    }, {} as Record<string, RepositoryResult>),
  };
};
