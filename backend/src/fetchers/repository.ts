// Fetchers for repository data and metrics

import { Organization, Repository } from '@octokit/graphql-schema';
import { Fetcher } from '..';
import { RepositoryResult } from '../../../types';

export const addRepositoriesToResult: Fetcher = async (
  result,
  octokit,
  config,
) => {
  const organization = await octokit.graphql.paginate<{
    organization: Organization;
  }>(
    `
  query ($cursor: String, $organization: String!) {
    organization(login:$organization) {
      repositories(privacy:PUBLIC, first:100, isFork:false, isArchived:false, after: $cursor)
      {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          nameWithOwner
          forkCount
          stargazerCount
          isFork
          isArchived
          hasIssuesEnabled
          hasProjectsEnabled
          hasDiscussionsEnabled
          projectsV2 {
            totalCount
          }
          discussions {
            totalCount
          }
          licenseInfo {
            name
          }
          watchers {
            totalCount
          }
          collaborators {
            totalCount
          }
          repositoryTopics(first: 20) {
            nodes {
              topic {
                name
              }
            }
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

  const filteredRepos = organization.organization.repositories.nodes!.filter(
    (repo) =>
      !(repo?.isArchived && !config.includeArchived) ||
      !(repo.isFork && !config.includeForks),
  ) as Repository[];

  return {
    ...result,
    repositories: filteredRepos.reduce(
      (acc, repo) => {
        return {
          ...acc,
          [repo.name]: {
            repositoryName: repo.name,
            repoNameWithOwner: repo.nameWithOwner,
            licenseName: repo.licenseInfo?.name || 'No License',
            topics: repo.repositoryTopics.nodes?.map(
              (node) => node?.topic.name,
            ),
            forksCount: repo.forkCount,
            watchersCount: repo.watchers.totalCount,
            starsCount: repo.stargazerCount,
            issuesEnabled: repo.hasIssuesEnabled,
            projectsEnabled: repo.hasProjectsEnabled,
            discussionsEnabled: repo.hasDiscussionsEnabled,
            collaboratorsCount: repo.collaborators?.totalCount || 0,
            projectsCount: repo.projects?.totalCount || 0,
            projectsV2Count: repo.projectsV2.totalCount,
          } as RepositoryResult,
        };
      },
      {} as Record<string, RepositoryResult>,
    ),
  };
};
