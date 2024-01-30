import { paginateGraphql } from "@octokit/plugin-paginate-graphql";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { Octokit } from "@octokit/rest";

/**
 * Creates a new octokit instance that is authenticated as the user
 * @param token personal access token
 * @returns Octokit authorized with the personal access token
 */
export const personalOctokit = (token: string) => {
  // Not sure if plugin order matters
  const ModifiedOctokit = Octokit.plugin(paginateGraphql, retry, throttling);
  return new ModifiedOctokit({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter, options, octokit, retryCount) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url} - retrying in ${retryAfter} seconds`
        );

        if (retryCount < 1) {
          // only retries once
          octokit.log.info(`Retry attempt ${retryCount + 1}, retrying...`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        );
      },
    },
  });
};

export const checkRateLimit = async (octokit: Octokit) => {
  const rateLimit = await octokit.rateLimit.get();
  const {
    core: { limit, remaining, reset },
  } = rateLimit.data.resources;
  const resetDate = new Date(reset * 1000);

  return {
    limit,
    remaining,
    reset,
    resetDate,
  };
};

export type CustomOctokit = ReturnType<typeof personalOctokit>;
