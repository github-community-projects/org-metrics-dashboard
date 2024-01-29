import "dotenv/config";
import fs from "fs-extra";
import {
  addIssueAndPrData,
  addMetaToResult,
  addOrganizationInfoToResult,
  addRepositoriesToResult,
} from "./fetchers";
import { CustomOctokit, octokit } from "./lib/octokit";

export interface Result {
  meta: {
    createdAt: string;
  };
  orgInfo: {
    login: string;
    name?: string;
    description: string | null;
    createdAt: string;
    repositoriesCount: number;
    // "membersWithRoleCount": number;
    // "projectsCount": number;
    // "projectsV2Count": number;
    // "teamsCount": number;
  };
  repositories: Record<string, RepositoryResult>;
}

export interface RepositoryResult {
  repositoryName: string;
  repoNameWithOwner: string;
  projectsCount: number;
  discussionsCount: number;
  forksCount: number;
  openIssuesCount: number;
  closedIssuesCount: number;
  openPullRequestsCount: number;
  mergedPullRequestsCount: number;
  licenseName: string;
  watchersCount: number;
}

interface Config {
  organization: string;
}

// Check for the GRAPHQL_TOKEN environment variable
if (!process.env.GRAPHQL_TOKEN) {
  console.log("GRAPHQL_TOKEN environment variable is required, exiting...");
  throw new Error("GRAPHQL_TOKEN environment variable is required!");
}

// Read in configuration for the fetchers
// TODO: Figure this out
const config: Config = {
  organization: "github",
};

export type Fetcher = (
  result: Result,
  octokit: CustomOctokit,
  config: Config
) => Promise<Result> | Result;

const pipeline =
  (octokit: CustomOctokit, config: Config) =>
  async (...fetchers: Fetcher[]) => {
    let result = {} as Result;

    for (const fetcher of fetchers) {
      result = await fetcher(result, octokit, config);
    }

    return result;
  };

const outputResult = async (result: Result) => {
  fs.outputJSONSync("./data.json", result, { spaces: 2 });
};

const result = await pipeline(octokit, config)(
  addMetaToResult,
  addOrganizationInfoToResult,
  addRepositoriesToResult,
  addIssueAndPrData
);

console.log(result);
outputResult(result);
