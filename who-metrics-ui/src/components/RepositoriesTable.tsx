import { InfoIcon } from "@primer/octicons-react";
import { Tooltip } from "@primer/react";
import {
  Card,
  Select,
  Flex,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { useState } from "react";
import Data from "../data/data.json";
import { RepositorySelector } from "./RepositorySelector";

const repos = Object.values(Data["repositories"]);
const licenses = repos
  .map((repo) => repo.licenseName)
  .filter((licenseName, index, array) => array.indexOf(licenseName) === index);
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

const headers = Object.keys(Labels);

const RepositoriesTable = () => {
  const [selectedLicense, setSelectedStatus] = useState("all");
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const isRepoSelected = (repo: Repo) =>
    (repo.licenseName === selectedLicense || selectedLicense === "all") &&
    (selectedNames.includes(repo.repositoryName) || selectedNames.length === 0);
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
          </Flex>
        </div>
        <div className="flex space-x-2">
          <RepositorySelector
            selectedNames={selectedNames}
            setSelectedNames={setSelectedNames}
            repositoryNames={repos.map((repo) => repo.repositoryName)}
          />
          <Select
            className="max-w-full sm:max-w-xs"
            defaultValue="all"
            onValueChange={setSelectedStatus}
          >
            {licenses.map((license) => (
              <SelectItem key={license} value={license}>
                {license === "" ? "None" : license}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Table className="mt-6">
          <TableHead>
            <TableRow>
              {headers.map((label, index) => (
                <TableHeaderCell
                  key={label}
                  className={index === 0 ? "" : "text-right"}
                >
                  {label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {repos
              .filter((repo) => isRepoSelected(repo))
              .map((repo) => (
                <TableRow key={repo.repositoryName}>
                  {headers.map((header, index) => {
                    const property = Labels[header];
                    const value = repo[property];
                    return (
                      <TableCell
                        key={value}
                        className={index === 0 ? "" : "text-right"}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </>
    </Card>
  );
};

export default RepositoriesTable;
