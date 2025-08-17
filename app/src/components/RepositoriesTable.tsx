/* eslint-disable primer-react/a11y-tooltip-interactive-trigger */
import {
  InfoIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  XIcon,
} from '@primer/octicons-react';

import {
  ActionList,
  Box,
  Button,
  Checkbox,
  FormControl,
  Text,
  TextInput,
  Tooltip,
} from '@primer/react';
import { json2csv } from 'json-2-csv';
import DataGrid, {
  Column,
  type RenderHeaderCellProps,
  type SortColumn,
} from 'react-data-grid';
import { Popover } from 'react-tiny-popover';

import { saveAs } from 'file-saver';
import {
  createContext,
  FC,
  KeyboardEvent,
  ReactElement,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { RepositoryResult } from '../../../types';
import Data from '../data/data.json';
import TopicCell from './TopicCell';

const repos = Object.values(Data['repositories']) as RepositoryResult[];

function inputStopPropagation(event: KeyboardEvent<HTMLInputElement>) {
  event.stopPropagation();
}

type Filter = {
  repositoryName?: Record<string, boolean>;
  licenseName?: Record<string, boolean>;
  topics?: Record<string, boolean>;
  collaboratorsCount?: Array<number | undefined>;
  watchersCount?: Array<number | undefined>;
  openIssuesCount?: Array<number | undefined>;
  openPullRequestsCount?: Array<number | undefined>;
  closedIssuesCount?: Array<number | undefined>;
  mergedPullRequestsCount?: Array<number | undefined>;
  forksCount?: Array<number | undefined>;
  openIssuesMedianAge?: Array<number | undefined>;
  openIssuesAverageAge?: Array<number | undefined>;
  closedIssuesMedianAge?: Array<number | undefined>;
  closedIssuesAverageAge?: Array<number | undefined>;
  issuesResponseMedianAge?: Array<number | undefined>;
  issuesResponseAverageAge?: Array<number | undefined>;
};

type SelectOption = {
  label: string | number;
  value: string | number;
};

const millisecondsToDisplayString = (milliseconds: number) => {
  const days = milliseconds / 1000 / 60 / 60 / 24;
  if (days === 0) {
    return 'N/A';
  }
  if (days < 1) {
    return `<1 day`;
  }

  if (days < 2) {
    return `1 day`;
  }

  return `${Math.floor(days)} days`;
};

// This selects a field to populate a dropdown with
const dropdownOptions = (
  field: keyof RepositoryResult,
  filter = '',
): SelectOption[] => {
  let options = [];
  if (field === 'topics') {
    options = Array.from(new Set(repos.flatMap((repo) => repo.topics))).sort();
  } else {
    options = Array.from(new Set(repos.map((repo) => repo[field])));
  }
  return options
    .map((fieldName) => ({
      // some fields are boolean (hasXxEnabled), so we need to convert them to strings
      label: typeof fieldName === 'boolean' ? fieldName.toString() : fieldName,
      value: typeof fieldName === 'boolean' ? fieldName.toString() : fieldName,
    }))
    .filter((fieldName) =>
      (fieldName.value as string).toLowerCase().includes(filter.toLowerCase()),
    );
};

// Helper function to get the selected option value from a filter and field
const getSelectedOption = (
  filters: Filter,
  filterName: keyof Filter,
  filterField: string,
  defaultValue = false,
) =>
  (filters[filterName] as Record<string, boolean>)[filterField] ?? defaultValue;

// Renderer for the min/max filter inputs
const MinMaxRenderer: FC<{
  headerCellProps: RenderHeaderCellProps<RepositoryResult>;
  filters: Filter;
  updateFilters: ((filters: Filter) => void) &
    ((filters: (updatedFilters: Filter) => Filter) => void);
  filterName: keyof Filter;
}> = ({ headerCellProps, filters, updateFilters, filterName }) => {
  return (
    <HeaderCellRenderer<RepositoryResult> {...headerCellProps}>
      {({ ...rest }) => (
        <Box className="w-full">
          <FormControl>
            <FormControl.Label htmlFor={`${filterName}Min`}>
              Min
            </FormControl.Label>
            <TextInput
              {...rest}
              id={`${filterName}Min`}
              className="w-full"
              type="number"
              placeholder="0"
              onChange={(e) => {
                updateFilters((globalFilters) => ({
                  ...globalFilters,
                  [filterName]: [
                    Number(e.target.value),
                    (
                      globalFilters[filterName] as Array<number | undefined>
                    )?.[1],
                  ],
                }));
              }}
              onKeyDown={inputStopPropagation}
              onClick={(e) => e.stopPropagation()}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label htmlFor={`${filterName}Max`}>
              Max
            </FormControl.Label>
            <TextInput
              {...rest}
              id={`${filterName}Max`}
              className="w-full"
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
          </FormControl>
        </Box>
      )}
    </HeaderCellRenderer>
  );
};

// Renderer for the searchable select filter
const SearchableSelectRenderer: FC<{
  headerCellProps: RenderHeaderCellProps<RepositoryResult>;
  filters: Filter;
  updateFilters: ((filters: Filter) => void) &
    ((filters: (newFilters: Filter) => Filter) => void);
  filterName: keyof Filter;
}> = ({ headerCellProps, filters, updateFilters, filterName }) => {
  const [filteredOptions, setFilteredOptions] = useState<string>('');
  const allSelectOptions = dropdownOptions(filterName, filteredOptions);

  return (
    <HeaderCellRenderer<RepositoryResult> {...headerCellProps}>
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
          <Box className="h-80 overflow-auto w-100 mt-2">
            <ActionList>
              <ActionList.Item
                onClick={() => {
                  updateFilters((otherFilters) => ({
                    ...otherFilters,
                    [filterName]: {
                      ...otherFilters[filterName],
                      all: !getSelectedOption(filters, filterName, 'all', true),
                    },
                  }));
                }}
              >
                <ActionList.LeadingVisual>
                  <Checkbox
                    type="checkbox"
                    checked={getSelectedOption(
                      filters,
                      filterName,
                      'all',
                      true,
                    )}
                  />
                </ActionList.LeadingVisual>
                <Box>All</Box>
              </ActionList.Item>
              {allSelectOptions.map((selectOption) => {
                if (selectOption.value === '') {
                  return (
                    <>
                      <ActionList.Item
                        onClick={() => {
                          updateFilters((otherFilters) => ({
                            ...otherFilters,
                            [filterName]: {
                              ...otherFilters[filterName],
                              [selectOption.value]: !getSelectedOption(
                                filters,
                                filterName,
                                selectOption.value as string,
                              ),
                            },
                          }));
                        }}
                      >
                        <ActionList.LeadingVisual>
                          <Checkbox
                            type="checkbox"
                            checked={
                              (
                                filters[filterName] as Record<string, boolean>
                              )?.[selectOption.value] ?? false
                            }
                          />
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
                        updateFilters((otherFilters) => ({
                          ...otherFilters,
                          [filterName]: {
                            ...otherFilters[filterName],
                            [selectOption.value]: !getSelectedOption(
                              filters,
                              filterName,
                              selectOption.value as string,
                            ),
                          },
                        }));
                      }}
                    >
                      <ActionList.LeadingVisual>
                        <Checkbox
                          type="checkbox"
                          checked={getSelectedOption(
                            filters,
                            filterName,
                            selectOption.value as string,
                          )}
                        />
                      </ActionList.LeadingVisual>
                      <Box>{selectOption.value}</Box>
                    </ActionList.Item>
                  </>
                );
              })}
            </ActionList>
          </Box>
        </Box>
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
  children: (args: { tabIndex: number; filters: Filter }) => ReactElement;
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
        ) : (
          <TriangleUpIcon size={24} className="opacity-0" />
        )}
        <Popover
          isOpen={isPopoverOpen}
          positions={['bottom', 'top', 'right', 'left']}
          padding={10}
          onClickOutside={() => setIsPopoverOpen(false)}
          ref={clickMeButtonRef} // if you'd like a ref to your popover's child, you can grab one here
          content={() => (
            // The click handler here is used to stop the header from being sorted
            <Box
              className="shadow-xl min-w-64 p-4 rounded"
              onClick={(e) => e.stopPropagation()}
              sx={{
                backgroundColor: 'Background',
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <FormControl>
                <FormControl.Label>Filter by {column.name}</FormControl.Label>
                {filterFunction({ tabIndex, filters })}
              </FormControl>
            </Box>
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
      </div>
    </div>
  );
};

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<Filter | undefined>(undefined);

type Comparator = (a: RepositoryResult, b: RepositoryResult) => number;

const getComparator = (sortColumn: keyof RepositoryResult): Comparator => {
  switch (sortColumn) {
    // number based sorting
    case 'closedIssuesCount':
    case 'collaboratorsCount':
    case 'discussionsCount':
    case 'forksCount':
    case 'totalIssuesCount':
    case 'mergedPullRequestsCount':
    case 'openIssuesCount':
    case 'openPullRequestsCount':
    case 'watchersCount':
    case 'openIssuesMedianAge':
    case 'openIssuesAverageAge':
    case 'closedIssuesMedianAge':
    case 'closedIssuesAverageAge':
    case 'issuesResponseMedianAge':
    case 'issuesResponseAverageAge':
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
    case 'repoNameWithOwner':
    case 'repositoryName':
      return (a, b) => {
        return a[sortColumn]
          .toLowerCase()
          .localeCompare(b[sortColumn].toLowerCase());
      };

    // Multi option, alphabetical
    case 'topics':
      return (a, b) => {
        const first = a[sortColumn].sort()[0];
        const second = b[sortColumn].sort()[0];
        if (!second) return -1;
        if (!first) return 1;
        return first.toLowerCase().localeCompare(second.toLowerCase());
      };

    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
};

// Default set of filters
const defaultFilters: Filter = {
  repositoryName: {
    all: true,
  },
  licenseName: {
    all: true,
  },
  topics: {
    all: true,
  },
};

// Helper for generating the csv blob
const generateCSV = (data: RepositoryResult[]): Blob => {
  const output = json2csv(data);
  return new Blob([output], { type: 'text/csv' });
};

const RepositoriesTable = () => {
  const [globalFilters, setGlobalFilters] = useState<Filter>(defaultFilters);

  // This needs a type, technically it's a Column but needs to be typed
  const labels: Record<string, Column<RepositoryResult>> = {
    Name: {
      key: 'repositoryName',
      name: 'Name',
      frozen: true,
      renderHeaderCell: (p) => (
        <SearchableSelectRenderer
          headerCellProps={p}
          filterName="repositoryName"
          filters={globalFilters}
          updateFilters={setGlobalFilters}
        />
      ),
      renderCell: (props) => (
        <a
          href={`https://github.com/${props.row.repoNameWithOwner}`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {props.row.repositoryName}
        </a>
      ),
    },
    Topics: {
      key: 'topics',
      name: 'Topics',
      width: 275,
      renderHeaderCell: (p) => {
        return (
          <SearchableSelectRenderer
            headerCellProps={p}
            filterName="topics"
            filters={globalFilters}
            updateFilters={setGlobalFilters}
          />
        );
      },
      renderCell: (props) => {
        // tabIndex === 0 is used as a proxy when the Cell is selected. See https://github.com/adazzle/react-data-grid/pull/3236
        const isSelected = props.tabIndex === 0;
        return <TopicCell topics={props.row.topics} isSelected={isSelected} />;
      },
    },
    License: {
      key: 'licenseName',
      name: 'License',

      renderHeaderCell: (p) => (
        <SearchableSelectRenderer
          headerCellProps={p}
          filterName="licenseName"
          filters={globalFilters}
          updateFilters={setGlobalFilters}
        />
      ),
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
    OpenIssuesMedianAge: {
      key: 'openIssuesMedianAge',
      name: 'Open Issues Median Age',
      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="openIssuesMedianAge"
          />
        );
      },
      renderCell: (p) => {
        return millisecondsToDisplayString(p.row.openIssuesMedianAge);
      },
    },
    OpenIssuesAverageAge: {
      key: 'openIssuesAverageAge',
      name: 'Open Issues Average Age',
      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="openIssuesAverageAge"
          />
        );
      },
      renderCell: (p) => {
        return millisecondsToDisplayString(p.row.openIssuesAverageAge);
      },
    },
    ClosedIssuesMedianAge: {
      key: 'closedIssuesMedianAge',
      name: 'Closed Issues Median Age',
      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="closedIssuesMedianAge"
          />
        );
      },
      renderCell: (p) => {
        return (
          <div className="m-auto">
            {millisecondsToDisplayString(p.row.closedIssuesMedianAge)}
          </div>
        );
      },
    },
    ClosedIssuesAverageAge: {
      key: 'closedIssuesAverageAge',
      name: 'Closed Issues Average Age',
      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="closedIssuesAverageAge"
          />
        );
      },
      renderCell: (p) => {
        return (
          <div className="m-auto">
            {millisecondsToDisplayString(p.row.closedIssuesAverageAge)}
          </div>
        );
      },
    },
    IssuesResponseMedianAge: {
      key: 'issuesResponseMedianAge',
      name: 'Issues Response Median Age',
      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="issuesResponseMedianAge"
          />
        );
      },
      renderCell: (p) => {
        return (
          <div className="m-auto">
            {millisecondsToDisplayString(p.row.issuesResponseMedianAge)}
          </div>
        );
      },
    },
    IssuesResponseAverageAge: {
      key: 'issuesResponseAverageAge',
      name: 'Issues Response Average Age',
      renderHeaderCell: (p) => {
        return (
          <MinMaxRenderer
            headerCellProps={p}
            filters={globalFilters}
            updateFilters={setGlobalFilters}
            filterName="issuesResponseAverageAge"
          />
        );
      },
      renderCell: (p) => {
        return (
          <div className="m-auto">
            {millisecondsToDisplayString(p.row.issuesResponseAverageAge)}
          </div>
        );
      },
    },
  } as const;

  const dataGridColumns = Object.entries(labels).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, columnProps]) => columnProps,
  );

  const subTitle = `${repos.length} total repositories`;

  const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);

  const sortRepos = (inputRepos: RepositoryResult[]) => {
    if (sortColumns.length === 0) {
      return repos;
    }

    const sortedRows = [...inputRepos].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(
          sort.columnKey as keyof RepositoryResult,
        );
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult;
        }
      }
      return 0;
    });

    return sortedRows;
  };

  const testTimeBasedFilter = (
    minDays: number | undefined,
    maxDays: number | undefined,
    timeInMs: number,
  ) => {
    const timeInDays = Math.floor(timeInMs / 1000 / 60 / 60 / 24);
    minDays = minDays || 0;
    maxDays = maxDays || Infinity;

    return timeInDays >= minDays && timeInDays <= maxDays;
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
    (inputRepos: RepositoryResult[]) => {
      const result = inputRepos.filter((repo) => {
        return (
          ((globalFilters.repositoryName?.[repo.repositoryName] ?? false) ||
            (globalFilters.repositoryName?.['all'] ?? false)) &&
          ((globalFilters.topics &&
            Object.entries(globalFilters.topics).some(
              ([selectedTopic, isSelected]) =>
                isSelected && repo.topics.includes(selectedTopic),
            )) ||
            (globalFilters.topics?.['all'] ?? false)) &&
          ((globalFilters.licenseName?.[repo.licenseName] ?? false) ||
            (globalFilters.licenseName?.['all'] ?? false)) &&
          (globalFilters.collaboratorsCount
            ? (globalFilters.collaboratorsCount?.[0] ?? 0) <=
                repo.collaboratorsCount &&
              repo.collaboratorsCount <=
                (globalFilters.collaboratorsCount[1] ?? Infinity)
            : true) &&
          (globalFilters.watchersCount
            ? (globalFilters.watchersCount?.[0] ?? 0) <= repo.watchersCount &&
              repo.watchersCount <= (globalFilters.watchersCount[1] ?? Infinity)
            : true) &&
          (globalFilters.openIssuesCount
            ? (globalFilters.openIssuesCount?.[0] ?? 0) <=
                repo.openIssuesCount &&
              repo.openIssuesCount <=
                (globalFilters.openIssuesCount[1] ?? Infinity)
            : true) &&
          (globalFilters.closedIssuesCount
            ? (globalFilters.closedIssuesCount?.[0] ?? 0) <=
                repo.closedIssuesCount &&
              repo.closedIssuesCount <=
                (globalFilters.closedIssuesCount[1] ?? Infinity)
            : true) &&
          (globalFilters.openPullRequestsCount
            ? (globalFilters.openPullRequestsCount?.[0] ?? 0) <=
                repo.openPullRequestsCount &&
              repo.openPullRequestsCount <=
                (globalFilters.openPullRequestsCount[1] ?? Infinity)
            : true) &&
          (globalFilters.mergedPullRequestsCount
            ? (globalFilters.mergedPullRequestsCount?.[0] ?? 0) <=
                repo.mergedPullRequestsCount &&
              repo.mergedPullRequestsCount <=
                (globalFilters.mergedPullRequestsCount[1] ?? Infinity)
            : true) &&
          (globalFilters.forksCount
            ? (globalFilters.forksCount?.[0] ?? 0) <= repo.forksCount &&
              repo.forksCount <= (globalFilters.forksCount[1] ?? Infinity)
            : true) &&
          (globalFilters.openIssuesMedianAge
            ? testTimeBasedFilter(
                globalFilters.openIssuesMedianAge[0],
                globalFilters.openIssuesMedianAge[1],
                repo.openIssuesMedianAge,
              )
            : true) &&
          (globalFilters.openIssuesAverageAge
            ? testTimeBasedFilter(
                globalFilters.openIssuesAverageAge[0],
                globalFilters.openIssuesAverageAge[1],
                repo.openIssuesAverageAge,
              )
            : true) &&
          (globalFilters.closedIssuesMedianAge
            ? testTimeBasedFilter(
                globalFilters.closedIssuesMedianAge[0],
                globalFilters.closedIssuesMedianAge[1],
                repo.closedIssuesMedianAge,
              )
            : true) &&
          (globalFilters.closedIssuesAverageAge
            ? testTimeBasedFilter(
                globalFilters.closedIssuesAverageAge[0],
                globalFilters.closedIssuesAverageAge[1],
                repo.closedIssuesAverageAge,
              )
            : true) &&
          (globalFilters.issuesResponseMedianAge
            ? testTimeBasedFilter(
                globalFilters.issuesResponseMedianAge[0],
                globalFilters.issuesResponseMedianAge[1],
                repo.issuesResponseMedianAge,
              )
            : true) &&
          (globalFilters.issuesResponseAverageAge
            ? testTimeBasedFilter(
                globalFilters.issuesResponseAverageAge[0],
                globalFilters.issuesResponseAverageAge[1],
                repo.issuesResponseAverageAge,
              )
            : true)
        );
      });

      return result;
    },
    [globalFilters],
  );

  const displayRows = filterRepos(sortRepos(repos));
  const createdDate = new Date(Data.meta.createdAt);

  return (
    <Box className="h-full flex flex-col">
      <Box className="py-2">
        <Box className="flex flex-row items-center justify-between">
          <Box className="flex flex-row space-x-4 justify-start items-center">
            <Box className="flex flex-row items-center space-x-1">
              <Tooltip aria-label="All of the repositories in this organization">
                <InfoIcon size={24} />
              </Tooltip>
              <Text as="p" className="text-sm">
                {subTitle}
              </Text>
            </Box>
            <Text as="p" className="text-sm">
              Last updated{' '}
              <Text suppressHydrationWarning>
                {createdDate.toLocaleDateString()}
              </Text>{' '}
              at{' '}
              <Text suppressHydrationWarning>
                {createdDate.toLocaleTimeString()}
              </Text>
            </Text>
          </Box>
          <Box className="flex flex-row items-center space-x-2">
            <Button
              variant="invisible"
              onClick={() => {
                setGlobalFilters(defaultFilters);
              }}
              className={globalFilters !== defaultFilters ? '' : 'opacity-0'}
            >
              Clear All Filters
            </Button>
            <Button
              variant="invisible"
              onClick={() => {
                saveAs(generateCSV(displayRows), 'output.csv');
              }}
            >
              Download CSV
            </Button>
          </Box>
        </Box>
      </Box>
      <FilterContext.Provider value={globalFilters}>
        {/* This is a weird hack to make the table fill the page */}
        <Box className="h-64 flex-grow">
          <DataGrid
            columns={dataGridColumns}
            rows={displayRows}
            rowKeyGetter={(repo) => repo.repositoryName}
            defaultColumnOptions={{
              sortable: true,
              resizable: true,
            }}
            sortColumns={sortColumns}
            onSortColumnsChange={setSortColumns}
            style={{ height: '100%', width: '100%' }}
            rowClass={(_, index) =>
              index % 2 === 1
                ? 'bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200'
                : 'hover:bg-slate-200 dark:hover:bg-slate-600'
            }
          />
        </Box>
      </FilterContext.Provider>
    </Box>
  );
};

export default RepositoriesTable;
