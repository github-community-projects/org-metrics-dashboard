// Fetchers for organization data and metrics

import { Fetcher } from "..";

export const addOrganizationInfoToResult: Fetcher = async (
  result,
  octokit,
  config
) => {
  const organization = await octokit.orgs.get({ org: config.organization });

  return {
    ...result,
    orgInfo: {
      login: organization.data.login,
      name: organization.data.name,
      description: organization.data.description,
      createdAt: organization.data.created_at,
      repositoriesCount: organization.data.public_repos,
    },
  };
};
