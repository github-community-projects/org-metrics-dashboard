import { InfoIcon } from "@primer/octicons-react";
import { Tooltip } from "@primer/react";
import { Card, Flex, Title, Text } from "@tremor/react";
import DataGrid from "react-data-grid";

import Data from "../data/data.json";

const repos = Object.values(Data["repositories"]);
type Repo = (typeof repos)[0];

const Labels: Record<string, keyof Repo> = {
  Name: "repositoryName",
  Collaborators: "collaboratorsCount",
  License: "licenseName",
  Watchers: "watchersCount",
  "Open Issues": "openIssuesCount",
  "Closed Issues": "closedIssuesCount",
  Projects: "projectsCount",
  "Open PRs": "openPullRequestsCount",
  "Merged PRs": "mergedPullRequestsCount",
  Forks: "forksCount",
} as const;

const DataGridColumns = Object.keys(Labels).map((label) => {
  return {
    key: Labels[label],
    name: label,
  };
});

const RepositoriesTable = () => {
  const subTitle = () => {
    return `${repos.length} total repositories`;
  };
  return (
    <Card className="mt-6">
      <>
        <div>
          <Flex
            className="space-x-0.5"
            justifyContent="start"
            alignItems="center"
          >
            <Title>Repositories </Title>
            <Tooltip aria-label="All of the repositories in this organization">
              <InfoIcon size={24} />
            </Tooltip>
            <Text>{subTitle()}</Text>
          </Flex>
        </div>
        <DataGrid
          columns={DataGridColumns}
          rows={repos}
          rowKeyGetter={(repo) => repo.repoName}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
        />
      </>
    </Card>
  );
};

export default RepositoriesTable;
