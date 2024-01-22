/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable primer-react/no-system-props */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */
import { InfoIcon } from '@primer/octicons-react';
import { Button, Tooltip } from '@primer/react';
import { Flex, Text } from '@tremor/react';
import DataGrid, { Column, type RenderHeaderCellProps, type SortColumn } from 'react-data-grid';
import { Popover } from 'react-tiny-popover';

import { createContext, FC, useCallback, useContext, useRef, useState } from 'react';
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
  licenseName?: string[];
  collaboratorsCount?: Array<number | undefined>;
  watchersCount?: Array<number | undefined>;
  openIssuesCount?: Array<number | undefined>;
  openPullRequestsCount?: Array<number | undefined>;
  closedIssuesCount?: Array<number | undefined>;
  mergedPullRequestsCount?: Array<number | undefined>;
  forksCount?: Array<number | undefined>;
};

const MinMaxRenderer: FC<{
  headerCellProps: RenderHeaderCellProps<Repo>;
  filters: Filter;
  updateFilters: ((filters: Filter) => void) & ((filters: (filters: Filter) => Filter) => void);
  filterName: keyof Filter;
}> = ({ headerCellProps, filters, updateFilters, filterName }) => {
  return (
    <FilterRenderer<Repo> {...headerCellProps}>
      {({ ...rest }) => (
        <div>
          <label htmlFor={`${filterName}Min`}>Min</label>
          <input
            {...rest}
            id={`${filterName}Min`}
            type="number"
            placeholder="0"
            onChange={(e) => {
              updateFilters((globalFilters) => ({
                ...globalFilters,
                [filterName]: [Number(e.target.value), globalFilters[filterName]?.[1]],
              }));
            }}
            onKeyDown={inputStopPropagation}
            onClick={(e) => e.stopPropagation()}
          />
          <label htmlFor={`${filterName}Max`}>Max</label>
          <input
            {...rest}
            id={`${filterName}Max`}
            type="number"
            placeholder="100"
            onChange={(e) =>
              updateFilters({
                ...filters,
                [filterName]: [0, Number(e.target.value)],
              })
            }
            onKeyDown={inputStopPropagation}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </FilterRenderer>
  );
};

/**
 * Wrapper for rendering column header cell
 * @param {
 * tabIndex: number;
 * column: Column<Row>;
 * children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
 * } props
 * @returns
 */
const FilterRenderer = <R = unknown,>({
  tabIndex,
  column,
  children: filterFunction,
  sortDirection,
}: RenderHeaderCellProps<R> & {
  children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
}) => {
  const filters = useContext(FilterContext)!;
  const clickMeButtonRef = useRef<HTMLButtonElement | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <div className="flex flex-row justify-between items-center">
      <div>{column.name}</div>
      <div className="flex flex-row items-center space-x-2">
        <span>{sortDirection === 'ASC' ? 'UP' : sortDirection === 'DESC' ? 'DOWN' : null}</span>
        <Popover
          isOpen={isPopoverOpen}
          positions={['bottom', 'top', 'right', 'left']}
          padding={10}
          onClickOutside={() => setIsPopoverOpen(false)}
          ref={clickMeButtonRef} // if you'd like a ref to your popover's child, you can grab one here
          content={() => (
            <div className="w-64" onClick={(e) => e.stopPropagation()}>
              <div className="bg-slate-500 p-2 w-full">
                <h4>Filter {column.name}</h4>
                {filterFunction({ tabIndex, filters })}
              </div>
            </div>
          )}
        >
          <Button
            color="primary"
            variant="invisible"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopoverOpen((isOpen) => !isOpen);
            }}
          >
            Filters
          </Button>
        </Popover>
      </div>
    </div>
  );
};

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<Filter | undefined>(undefined);

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
    licenseName: [],
  } as Filter);

  // This needs a type, technically it's a Column but needs to be typed
  const labels: Record<string, Column<Repo>> = {
    Name: {
      key: 'repositoryName',
      name: 'Name',

      renderHeaderCell: (p) => {
        return (
          <FilterRenderer<Repo> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                value={filters['repositoryName']}
                onChange={(e) =>
                  setGlobalFilters((otherFilters) => ({
                    ...otherFilters,
                    repositoryName: e.target.value,
                  }))
                }
                onKeyDown={inputStopPropagation}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </FilterRenderer>
        );
      },
    },
    License: {
      key: 'licenseName',
      name: 'License',

      renderHeaderCell: (p) => {
        return (
          <FilterRenderer<Repo> {...p}>
            {({ filters, ...rest }) => (
              <select
                {...rest}
                multiple
                value={filters['licenseName']}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions).map((o) => o.value);
                  setGlobalFilters((otherFilters) => ({
                    ...otherFilters,
                    licenseName: selectedOptions,
                  }));
                }}
                onKeyDown={selectStopPropagation}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="all" defaultChecked={globalFilters.licenseName?.includes('all')}>
                  All
                </option>
                {dropdownOptions('licenseName').map((d) => {
                  if (d.value === '') {
                    return (
                      <option key={d.value} value={d.value}>
                        No License
                      </option>
                    );
                  }

                  return (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  );
                })}
              </select>
            )}
          </FilterRenderer>
        );
      },
    },
    Collaborators: {
      key: 'collaboratorsCount',
      name: 'Collaborator Count',
      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="collaboratorsCount"
          />
        );
      },
    },
    Watchers: {
      key: 'watchersCount',
      name: 'Watchers Count',

      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="watchersCount"
          />
        );
      },
    },
    'Open Issues': {
      key: 'openIssuesCount',
      name: 'Issues Count',

      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="openIssuesCount"
          />
        );
      },
    },
    'Closed Issues': {
      key: 'closedIssuesCount',
      name: 'Closed Issues Count',

      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="closedIssuesCount"
          />
        );
      },
    },
    'Open PRs': {
      key: 'openPullRequestsCount',
      name: 'Open PRs Count',

      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="openPullRequestsCount"
          />
        );
      },
    },
    'Merged PRs': {
      key: 'mergedPullRequestsCount',
      name: 'Merged PRs Count',

      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="mergedPullRequestsCount"
          />
        );
      },
    },
    Forks: {
      key: 'forksCount',
      name: 'Forks Count',

      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="forksCount"
          />
        );
      },
    },
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

  /**
   * Uses globalFilters to filter the repos that are then passed to sortRepos
   *
   * NOTE: We use some hacks like adding 'all' to the licenseName filter to
   *      make it easier to filter the repos.
   */
  const filterRepos = useCallback(
    (inputRepos: Repo[]) => {
      const result = inputRepos.filter((repo) => {
        return (
          (globalFilters.repositoryName ? repo.repositoryName.includes(globalFilters.repositoryName) : true) &&
          ((globalFilters.licenseName?.length ?? 0 > 0
            ? globalFilters.licenseName?.includes(repo.licenseName)
            : true) ||
            globalFilters.licenseName?.includes('all')) &&
          (globalFilters.collaboratorsCount
            ? (globalFilters.collaboratorsCount?.[0] ?? 0) <= repo.collaboratorsCount &&
            repo.collaboratorsCount <= (globalFilters.collaboratorsCount[1] ?? Infinity)
            : true) &&
          (globalFilters.watchersCount
            ? (globalFilters.watchersCount?.[0] ?? 0) <= repo.watchersCount &&
            repo.watchersCount <= (globalFilters.watchersCount[1] ?? Infinity)
            : true) &&
          (globalFilters.openIssuesCount
            ? (globalFilters.openIssuesCount?.[0] ?? 0) <= repo.openIssuesCount &&
            repo.openIssuesCount <= (globalFilters.openIssuesCount[1] ?? Infinity)
            : true) &&
          (globalFilters.closedIssuesCount
            ? (globalFilters.closedIssuesCount?.[0] ?? 0) <= repo.closedIssuesCount &&
            repo.closedIssuesCount <= (globalFilters.closedIssuesCount[1] ?? Infinity)
            : true) &&
          (globalFilters.openPullRequestsCount
            ? (globalFilters.openPullRequestsCount?.[0] ?? 0) <= repo.openPullRequestsCount &&
            repo.openPullRequestsCount <= (globalFilters.openPullRequestsCount[1] ?? Infinity)
            : true) &&
          (globalFilters.mergedPullRequestsCount
            ? (globalFilters.mergedPullRequestsCount?.[0] ?? 0) <= repo.mergedPullRequestsCount &&
            repo.mergedPullRequestsCount <= (globalFilters.mergedPullRequestsCount[1] ?? Infinity)
            : true) &&
          (globalFilters.forksCount
            ? (globalFilters.forksCount?.[0] ?? 0) <= repo.forksCount &&
            repo.forksCount <= (globalFilters.forksCount[1] ?? Infinity)
            : true)
        );
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
        <div className="h-full flex-1">
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
