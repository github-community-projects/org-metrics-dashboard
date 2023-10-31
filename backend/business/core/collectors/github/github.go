package github

import (
	"context"
	"fmt"

	"github.com/shurcooL/githubv4"
	"github.com/who-metrics/business/core/collectors/github/fetchers"
)

type GitHubCollector struct {
	fetchers Fetchers
	// format   string
}

func NewGitHubCollector(client *githubv4.Client, organizationName string) *GitHubCollector {
	return &GitHubCollector{fetchers: buildFetchers(client, organizationName)}
}

type RepositoryInfoResult struct {
	fetchers.ContributionInfoResult
	fetchers.RepoInfoResult
}

type ResultOutput struct {
	OrgInfo      *fetchers.OrgInfoResult         `json:"orgInfo"`
	Repositories map[string]RepositoryInfoResult `json:"repositories"`
}

func (c *GitHubCollector) Collect(ctx context.Context) ([]string, []error) {
	errors := make([]error, 0)
	orgInfo, err := c.fetchers.OrgInfo.Fetch(ctx)
	if err != nil {
		errors = append(errors, err)
	}
	reposInfo, err := c.fetchers.ReposInfo.Fetch(ctx)
	if err != nil {
		errors = append(errors, err)
	}
	contributionInfo, err := c.fetchers.ContributionInfo.Fetch(ctx)
	if err != nil {
		errors = append(errors, err)
	}

	// Build the final result
	result := ResultOutput{
		OrgInfo:      orgInfo,
		Repositories: make(map[string]RepositoryInfoResult),
	}

	for _, repo := range *reposInfo {
		result.Repositories[repo.RepoName] = RepositoryInfoResult{
			RepoInfoResult:         repo,
			ContributionInfoResult: (*contributionInfo)[repo.RepoName],
		}
	}

	fmt.Println(result)

	return []string{}, errors
	// // Handle csv format
	// if c.format == "csv" {
	// 	// TODO: process with goroutines
	// 	results, errors := make([]string, len(c.fetchers)), make([]error, 0)

	// 	for _, fetcher := range c.fetchers {
	// 		result, err := fetcher.Fetch(ctx)
	// 		if err != nil {
	// 			errors = append(errors, err)
	// 		}
	// 		results = append(results, result)
	// 	}
	// 	return results, errors

	// }

	// Handle json format
}

type Fetchers struct {
	OrgInfo          *fetchers.OrgInfoFetcher
	ReposInfo        *fetchers.ReposInfoFetcher
	ContributionInfo *fetchers.ContributionInfoFetcher
}

func buildFetchers(client *githubv4.Client, organizationName string) Fetchers {
	// TODO:
	// load all variables from env or somewhere else
	// it should look something like this:
	/*
		vars := GetVars()
		return []Fetcher{
			&fetchers.OrgInfo{client: client, orgName: vars.orgName},
		}
	*/
	fetchers := Fetchers{
		OrgInfo:          fetchers.NewOrgInfo(client, organizationName),
		ReposInfo:        fetchers.NewReposInfoFetcher(client, organizationName),
		ContributionInfo: fetchers.NewContributionInfoFetcher(client, organizationName),
	}

	// TODO: map the fetchers to keys so we can easily access them
	return fetchers
}
