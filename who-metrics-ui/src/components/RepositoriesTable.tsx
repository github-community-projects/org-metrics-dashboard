import { InfoIcon } from '@primer/octicons-react';
import { Tooltip } from '@primer/react';
import { Flex, Text } from '@tremor/react';
import DataGrid, { Column, type RenderHeaderCellProps, type SortColumn } from 'react-data-grid';

import { createContext, useCallback, useContext, useState } from 'react';
import Data from '../data/data.json';
const repos = Object.values(Data['repositories']);
type Repo = (typeof repos)[0];

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  event.stopPropagation();
}

function selectStopPropagation(event: React.KeyboardEvent<HTMLSelectElement>) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.stopPropagation();
  }
}

type Filter = {
  repositoryName?: string;
};

function FilterRenderer<R>({
  tabIndex,
  column,
  children,
}: RenderHeaderCellProps<R> & {
  children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  return (
    <div>
      <div>{column.name}</div>
      Hello
      <div>{children({ tabIndex, filters })}</div>
    </div>
  );
}

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<Filter | undefined>(undefined);

type Row = Record<keyof Repo, string>;

type Comparator = (a: Repo, b: Repo) => number;

const getComparator = (sortColumn: keyof Repo): Comparator => {
  switch (sortColumn) {
    // number based sorting
    case 'closedIssuesCount':
    case 'collaboratorsCount':
    case 'discussionsCount':
    case 'forksCount':
    case 'issuesCount':
    case 'mergedPullRequestsCount':
    case 'openIssuesCount':
    case 'openPullRequestsCount':
    case 'projectsCount':
    case 'watchersCount':
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
    case 'licenseName':
    case 'repoName':
    case 'repositoryName':
      return (a, b) => {
        return a[sortColumn].toLowerCase().localeCompare(b[sortColumn].toLowerCase());
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
};

const RepositoriesTable = () => {
  const [globalFilters, setGlobalFilters] = useState<Filter>({
    repositoryName: undefined,
  } as Filter);

  // This needs a type, technically it's a Column but needs to be typed
  const labels: Record<string, Column<Repo>> = {
    Name: {
      key: 'repositoryName',
      name: 'Name',
      headerCellClass: 'h-32',
      // renderHeaderCell: (p) => {
      //   console.log(p);
      //   return (
      //     <FilterRenderer<Row> {...(p as any)}>
      //       {({ filters, ...rest }) => (
      //         <input
      //           {...rest}
      //           value={filters['repositoryName']}
      //           onChange={(e) =>
      //             setGlobalFilters((otherFilters) => ({
      //               ...otherFilters,
      //               repositoryName: e.target.value,
      //             }))
      //           }
      //           onKeyDown={inputStopPropagation}
      //           onClick={(e) => e.stopPropagation()}
      //         />
      //       )}
      //     </FilterRenderer>
      //   );
      // },
    },
    // Collaborators: "collaboratorsCount",
    // License: "licenseName",
    // Watchers: "watchersCount",
    // "Open Issues": "openIssuesCount",
    // "Closed Issues": "closedIssuesCount",
    // "Open PRs": "openPullRequestsCount",
    // "Merged PRs": "mergedPullRequestsCount",
    // Forks: "forksCount",
  } as const;

  const dataGridColumns = Object.entries(labels).map(([_, columnProps]) => columnProps);

  const subTitle = () => {
    return `${repos.length} total repositories`;
  };

  // This selects a field to populate a dropdown with
  const dropdownOptions = (field: keyof Repo) =>
    Array.from(new Set(repos.map((r) => r[field]))).map((d) => ({
      label: d,
      value: d,
    }));

  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);

  const sortRepos = (inputRepos: Repo[]) => {
    if (sortColumns.length === 0) {
      return repos;
    }

    const sortedRows = [...inputRepos].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey as keyof Repo);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult;
        }
      }
      return 0;
    });

    return sortedRows;
  };

  const filterRepos = useCallback(
    (inputRepos: Repo[]) => {
      const result = inputRepos.filter((repo) => {
        return globalFilters.repositoryName ? repo.repositoryName.includes(globalFilters.repositoryName) : true;
      });

      return result;
    },
    [globalFilters],
  );

  return (
    <div>
      <div>
        <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
          <Tooltip aria-label="All of the repositories in this organization">
            <InfoIcon size={24} />
          </Tooltip>
          <Text>{subTitle()}</Text>
        </Flex>
      </div>
      <FilterContext.Provider value={globalFilters}>
        <div className="h-full sm:max-h-140">
          <DataGrid
            className="h-full sm:min-h-40"
            columns={dataGridColumns}
            rows={filterRepos(sortRepos(repos))}
            rowKeyGetter={(repo) => repo.repoName}
            defaultColumnOptions={{
              sortable: true,
              resizable: true,
            }}
            sortColumns={sortColumns}
            onSortColumnsChange={setSortColumns}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </FilterContext.Provider>
    </div>
  );
};

export default RepositoriesTable;
