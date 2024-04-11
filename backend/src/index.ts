import 'dotenv/config';
import fs from 'fs-extra';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';
import { RepositoryResult } from '../../types';
import {
  addDiscussionData,
  addIssueAndPrData,
  addIssueMetricsData,
  addMetaToResult,
  addOrganizationInfoToResult,
  addRepositoriesToResult,
} from './fetchers';
import { CustomOctokit, checkRateLimit, personalOctokit } from './lib/octokit';

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

export type Fetcher = (
  result: Result,
  octokit: CustomOctokit,
  config: Config,
) => Promise<Result> | Result;

export interface Config {
  organization: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  since?: string; // Used for limiting the date range of items to fetch
}

// Check for the GRAPHQL_TOKEN environment variable
if (!process.env.GRAPHQL_TOKEN) {
  console.log('GRAPHQL_TOKEN environment variable is required, exiting...');
  throw new Error('GRAPHQL_TOKEN environment variable is required!');
}

console.log('Starting GitHub organization metrics fetcher');
console.log('🔑  Authenticating with GitHub');

const octokit = personalOctokit(process.env.GRAPHQL_TOKEN!);

// Read in configuration for the fetchers
let yamlConfig: Partial<Config> = {};
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configFileLocation = resolve(__dirname, '../../config.yml');
try {
  const configFile = fs.readFileSync(configFileLocation, 'utf-8');
  yamlConfig = parse(configFile) as Partial<Config>;
} catch (e) {
  console.error('Error reading config file at', configFileLocation);
  console.log(e);
}

if (!process.env.ORGANIZATION_NAME && !yamlConfig.organization) {
  console.log(
    'ORGANIZATION_NAME environment variable or `organization` in config.yml is required',
  );
  throw new Error(
    'ORGANIZATION_NAME environment variable or `organization` in config.yml is required, exiting...',
  );
}

const config: Config = {
  includeForks: false,
  includeArchived: false,
  ...yamlConfig,
  // You can override the organization in an env variable ORGANIZATION_NAME
  organization: process.env.ORGANIZATION_NAME ?? yamlConfig.organization ?? '',
  // Default since date is 365 days ago (1 year)
  since: yamlConfig.since
    ? new Date(yamlConfig.since).toISOString()
    : new Date(Date.now() - 365 * (24 * 60 * 60 * 1000)).toISOString(),
};

console.log(`📋  Configuration: \n${JSON.stringify(config, null, 2)}`);

const pipeline =
  (octokit: CustomOctokit, config: Config) =>
  async (...fetchers: Fetcher[]) => {
    let result = {} as Result;

    for (const fetcher of fetchers) {
      console.log(`🔧  Running fetcher ${fetcher.name}`);
      result = await fetcher(result, octokit, config);
      console.log(`✨  Finished ${fetcher.name}`);
      const res = await checkRateLimit(octokit);
      console.log(
        `⚙️  Rate limit: ${res.remaining}/${
          res.limit
        } remaining until ${res.resetDate.toLocaleString()}`,
      );
    }

    return result;
  };

const outputResult = async (result: Result) => {
  const destination = '../app/src/data/data.json';
  fs.outputJSONSync(destination, result, { spaces: 2 });
  console.log(`📦  Wrote result to ${destination}`);
};

const result = await pipeline(octokit, config)(
  addMetaToResult,
  addOrganizationInfoToResult,
  addRepositoriesToResult,
  addIssueAndPrData,
  addDiscussionData,
  addIssueMetricsData,
);

outputResult(result);
