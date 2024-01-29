import { paginateGraphql } from "@octokit/plugin-paginate-graphql";
import { Octokit } from "@octokit/rest";

/**
 * Creates a new octokit instance that is authenticated as the user
 * @param token personal access token
 * @returns Octokit authorized with the personal access token
 */
const personalOctokit = (token: string) => {
  const ModifiedOctokit = Octokit.plugin(paginateGraphql);
  return new ModifiedOctokit({
    auth: token,
  });
};

export type CustomOctokit = ReturnType<typeof personalOctokit>;
export const octokit = personalOctokit(process.env.GRAPHQL_TOKEN!);
