import { paginateGraphql } from "@octokit/plugin-paginate-graphql";
import { retry } from "@octokit/plugin-retry";
import { Octokit } from "@octokit/rest";

/**
 * Creates a new octokit instance that is authenticated as the user
 * @param token personal access token
 * @returns Octokit authorized with the personal access token
 */
export const personalOctokit = (token: string) => {
  // Not sure if plugin order matters
  const ModifiedOctokit = Octokit.plugin(paginateGraphql, retry);
  return new ModifiedOctokit({
    auth: token,
  });
};

export type CustomOctokit = ReturnType<typeof personalOctokit>;
