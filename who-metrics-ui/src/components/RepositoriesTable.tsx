import { InfoIcon } from "@primer/octicons-react";
import { Tooltip } from "@primer/react";
import { Flex, Text } from "@tremor/react";
import DataGrid, { type SortColumn } from "react-data-grid";

import Data from "../data/data.json";
import { useState } from "react";
const repos = Object.values(Data["repositories"]);
type Repo = (typeof repos)[0];

const Labels: Record<string, keyof Repo> = {
  Name: "repositoryName",
  Collaborators: "collaboratorsCount",
  License: "licenseName",
  Watchers: "watchersCount",
  "Open Issues": "openIssuesCount",
  "Closed Issues": "closedIssuesCount",
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

type Comparator = (a: Repo, b: Repo) => number;

const getComparator = (sortColumn: keyof Repo): Comparator => {
  switch (sortColumn) {
    // number based sorting
    case "closedIssuesCount":
    case "collaboratorsCount":
    case "discussionsCount":
    case "forksCount":
    case "issuesCount":
    case "mergedPullRequestsCount":
    case "openIssuesCount":
    case "openPullRequestsCount":
    case "projectsCount":
    case "watchersCount":
      return (a, b) => {
        if (a[sortColumn] === b[sortColumn]) {
          return 0;
        }

        if (a[sortColumn] > b[sortColumn]) {
          return 1;
        }

        return -1;
      };

    // alphabetical sorting
    case "licenseName":
    case "repoName":
    case "repositoryName":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
};

const RepositoriesTable = () => {
  const subTitle = () => {
    return `${repos.length} total repositories`;
  };

  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);

  const sortedRepos = () => {
    if (sortColumns.length === 0) return repos;

    const sortedRows = [...repos].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey as keyof Repo);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === "ASC" ? compResult : -compResult;
        }
      }
      return 0;
    });

    return sortedRows;
  };

  return (
    <div>
      <div>
        <Flex
          className="space-x-0.5"
          justifyContent="start"
          alignItems="center"
        >
          <Tooltip aria-label="All of the repositories in this organization">
            <InfoIcon size={24} />
          </Tooltip>
          <Text>{subTitle()}</Text>
        </Flex>
      </div>
      <div className="h-full sm:max-h-140">
        <DataGrid
          columns={DataGridColumns}
          rows={sortedRepos()}
          rowKeyGetter={(repo) => repo.repoName}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default RepositoriesTable;
