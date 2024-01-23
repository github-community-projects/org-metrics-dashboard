import { InfoIcon, TriangleDownIcon, TriangleUpIcon, XIcon } from '@primer/octicons-react';
import { ActionList, Box, Button, Checkbox, FormControl, TextInput, Tooltip } from '@primer/react';
import { Text } from '@tremor/react';
import DataGrid, { Column, type RenderHeaderCellProps, type SortColumn } from 'react-data-grid';
import { Popover } from 'react-tiny-popover';

import { createContext, FC, useCallback, useContext, useRef, useState } from 'react';
import Data from '../data/data.json';
const repos = Object.values(Data['repositories']);
type Repo = (typeof repos)[0];

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  event.stopPropagation();
}

type Filter = {
  repositoryName?: string;
  licenseName?: Record<string, boolean>;
  collaboratorsCount?: Array<number | undefined>;
  watchersCount?: Array<number | undefined>;
  openIssuesCount?: Array<number | undefined>;
  openPullRequestsCount?: Array<number | undefined>;
  closedIssuesCount?: Array<number | undefined>;
  mergedPullRequestsCount?: Array<number | undefined>;
  forksCount?: Array<number | undefined>;
};

// Renderer for the min/max filter inputs
const MinMaxRenderer: FC<{
  headerCellProps: RenderHeaderCellProps<Repo>;
  filters: Filter;
  updateFilters: ((filters: Filter) => void) & ((filters: (filters: Filter) => Filter) => void);
  filterName: keyof Filter;
}> = ({ headerCellProps, filters, updateFilters, filterName }) => {
  return (
    <HeaderCellRenderer<Repo> {...headerCellProps}>
      {({ ...rest }) => (
        <div>
          <FormControl>
            <FormControl.Label htmlFor={`${filterName}Min`}>Min</FormControl.Label>
            <TextInput  {...rest}
              id={`${filterName}Min`}
              type="number"
              placeholder="0"
              onChange={(e) => {
                updateFilters((globalFilters) => ({
                  ...globalFilters,
                  [filterName]: [Number(e.target.value), (globalFilters[filterName] as Array<number | undefined>)?.[1]],
                }));
              }}
              onKeyDown={inputStopPropagation}
              onClick={(e) => e.stopPropagation()} />
          </FormControl>
          <FormControl>
            <FormControl.Label htmlFor={`${filterName}Max`}>Max</FormControl.Label>
            <TextInput   {...rest}
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
              onClick={(e) => e.stopPropagation()} />
          </FormControl>
        </div>
      )}
    </HeaderCellRenderer>
  );
};

// Wrapper for rendering column header cell
const HeaderCellRenderer = <R = unknown,>({
  tabIndex,
  column,
  children: filterFunction,
  sortDirection,
}: RenderHeaderCellProps<R> & {
  children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
}) => {
  const filters = useContext(FilterContext)!;
  const clickMeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <div className="flex flex-row justify-between items-center">
      <div>{column.name}</div>
      <div className="flex flex-row items-center space-x-2">
        {sortDirection === 'DESC' ? (
          <TriangleDownIcon size={24} />
        ) : sortDirection === 'ASC' ? (
          <TriangleUpIcon size={24} />
        ) : <TriangleUpIcon size={24} className="opacity-0" />}
        <Popover
          isOpen={isPopoverOpen}
          positions={['bottom', 'top', 'right', 'left']}
          padding={10}
          onClickOutside={() => setIsPopoverOpen(false)}
          ref={clickMeButtonRef} // if you'd like a ref to your popover's child, you can grab one here
          content={() => (
            // The click handler here is used to stop the header from being sorted
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div className="bg-white shadow-xl min-w-64 p-4 rounded" onClick={(e) => e.stopPropagation()}>
              <div className="w-full">
                <FormControl>
                  <FormControl.Label>Filter by {column.name}</FormControl.Label>
                  {filterFunction({ tabIndex, filters })}
                </FormControl>
              </div>
            </div>
          )}
        >
          <Button
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
      </div >
    </div >
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

// Default set of filters
const defaultFilters: Filter = {
  licenseName: {
    all: true,
  }
}

const RepositoriesTable = () => {
  const [globalFilters, setGlobalFilters] = useState<Filter>(defaultFilters);

  // This needs a type, technically it's a Column but needs to be typed
  const labels: Record<string, Column<Repo>> = {
    Name: {
      key: 'repositoryName',
      name: 'Name',

      renderHeaderCell: (p) => {
        return (
          <HeaderCellRenderer<Repo> {...p}>
            {({ filters, ...rest }) => (
              <TextInput
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
          </HeaderCellRenderer>
        );
      },
    },
    License: {
      key: 'licenseName',
      name: 'License',

      renderHeaderCell: (p) => {
        // This is fine because we know it's going to be rendered as a component
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [filteredOptions, setFilteredOptions] = useState<string>('');

        return (
          <HeaderCellRenderer<Repo> {...p}>
            {({ ...rest }) => (
              <Box>
                <TextInput
                  {...rest}
                  className="w-full"
                  value={filteredOptions}
                  onChange={(e) => setFilteredOptions(e.target.value)}
                  trailingAction={
                    <TextInput.Action
                      onClick={() => {
                        setFilteredOptions('');
                      }}
                      icon={XIcon}
                      aria-label="Clear input"
                      sx={{ color: 'fg.subtle' }}
                    />
                  }
                />
                <ActionList>
                  <ActionList.Item
                    onClick={() => {
                      setGlobalFilters((otherFilters) => ({
                        ...otherFilters,
                        licenseName: { ...otherFilters.licenseName, all: !otherFilters.licenseName?.['all'] },
                      }));
                    }}
                  >
                    <ActionList.LeadingVisual>
                      <Checkbox type="checkbox" checked={globalFilters.licenseName?.['all'] ?? true} />
                    </ActionList.LeadingVisual>
                    <Box>All</Box>
                  </ActionList.Item>
                  {dropdownOptions('licenseName', filteredOptions).map((d) => {
                    if (d.value === '') {
                      return (
                        <>
                          <ActionList.Item
                            onClick={() => {
                              setGlobalFilters((otherFilters) => ({
                                ...otherFilters,
                                licenseName: {
                                  ...otherFilters.licenseName,
                                  [d.value]: !otherFilters.licenseName?.[d.value],
                                },
                              }));
                            }}
                          >
                            <ActionList.LeadingVisual>
                              <Checkbox type="checkbox" checked={globalFilters.licenseName?.[d.value] ?? false} />
                            </ActionList.LeadingVisual>
                            <Box>No License</Box>
                          </ActionList.Item>
                        </>
                      );
                    }

                    return (
                      <>
                        <ActionList.Item
                          onClick={() => {
                            setGlobalFilters((otherFilters) => ({
                              ...otherFilters,
                              licenseName: {
                                ...otherFilters.licenseName,
                                [d.value]: !otherFilters.licenseName?.[d.value],
                              },
                            }));
                          }}
                        >
                          <ActionList.LeadingVisual>
                            <Checkbox type="checkbox" checked={globalFilters.licenseName?.[d.value] ?? false} />
                          </ActionList.LeadingVisual>
                          <Box>{d.value}</Box>
                        </ActionList.Item>
                      </>
                    );
                  })}
                </ActionList>
              </Box>
            )}
          </HeaderCellRenderer>
        );
      },
    },
    Collaborators: {
      key: 'collaboratorsCount',
      name: 'Collaborators',
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
      name: 'Watchers',

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
      name: 'Open Issues',

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
      name: 'Closed Issues',

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
      name: 'Open PRs',

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
      name: 'Merged PRs',

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
      name: 'Total Forks',

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dataGridColumns = Object.entries(labels).map(([_, columnProps]) => columnProps);

  const subTitle = () => {
    return `${repos.length} total repositories`;
  };

  // This selects a field to populate a dropdown with
  const dropdownOptions = (field: keyof Repo, filter = '') =>
    Array.from(new Set(repos.map((r) => r[field])))
      .map((d) => ({
        label: d,
        value: d,
      }))
      .filter((d) => (d.value as string).toLowerCase().includes(filter.toLowerCase()));

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
   * 
   * This is kind of a mess, but it works
   */
  const filterRepos = useCallback(
    (inputRepos: Repo[]) => {
      const result = inputRepos.filter((repo) => {
        return (
          (globalFilters.repositoryName ? repo.repositoryName.includes(globalFilters.repositoryName) : true) &&
          ((globalFilters.licenseName?.[repo.licenseName] ?? false) || (globalFilters.licenseName?.['all'] ?? false)) &&
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
    <div className='h-full flex flex-col'>
      <div className='py-2'>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row space-x-1 justify-start items-center">
            <Tooltip aria-label="All of the repositories in this organization">
              <InfoIcon size={24} />
            </Tooltip>
            <Text>{subTitle()}</Text>
          </div>
          <div>
            <Button
              variant="invisible"
              onClick={() => {
                setGlobalFilters(defaultFilters);
              }}
              className={globalFilters !== defaultFilters ? '' : 'opacity-0'}
            >
              Clear All Filters
            </Button>


          </div>
        </div>
      </div>
      <FilterContext.Provider value={globalFilters}>
        { /* This is a weird hack to make the table fill the page */}
        <div className="h-64 flex-grow">
          <DataGrid
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
    </div >
  );
};

export default RepositoriesTable;
