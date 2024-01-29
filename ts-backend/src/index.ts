import "dotenv/config";
import fs from "fs-extra";
import {
  addIssueAndPrData,
  addMetaToResult,
  addOrganizationInfoToResult,
  addRepositoriesToResult,
} from "./fetchers";
import { CustomOctokit, personalOctokit } from "./lib/octokit";

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
  issuesEnabled: boolean;
  stars: number;
}

export type Fetcher = (
  result: Result,
  octokit: CustomOctokit,
  config: Config
) => Promise<Result> | Result;

export interface Config {
  organization: string;
  includeForks?: boolean;
  includeArchived?: boolean;
}

// Check for the GRAPHQL_TOKEN environment variable
if (!process.env.GRAPHQL_TOKEN) {
  console.log("GRAPHQL_TOKEN environment variable is required, exiting...");
  throw new Error("GRAPHQL_TOKEN environment variable is required!");
}

console.log("Starting GitHub organization metrics fetcher");
console.log("🔑  Authenticating with GitHub");

const octokit = personalOctokit(process.env.GRAPHQL_TOKEN!);

// Read in configuration for the fetchers
// TODO: Figure this out
const config: Config = {
  organization: "github",
  includeForks: false,
  includeArchived: false,
};

const pipeline =
  (octokit: CustomOctokit, config: Config) =>
  async (...fetchers: Fetcher[]) => {
    let result = {} as Result;

    for (const fetcher of fetchers) {
      console.log(`🔧  Running fetcher ${fetcher.name}`);
      result = await fetcher(result, octokit, config);
      console.log(`✨  Finished ${fetcher.name}`);
    }

    return result;
  };

const outputResult = async (result: Result) => {
  const destination = "./data.json";
  fs.outputJSONSync(destination, result, { spaces: 2 });
  console.log(`📦  Wrote result to ${destination}`);
};

const result = await pipeline(octokit, config)(
  addMetaToResult,
  addOrganizationInfoToResult,
  addRepositoriesToResult,
  addIssueAndPrData
);

console.log(result);
outputResult(result);
