package github

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/shurcooL/githubv4"
	"github.com/who-metrics/business/core/collectors/github/fetchers"
)

type GitHubCollector struct {
	fetchers Fetchers
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

func (c *GitHubCollector) Collect(ctx context.Context) []error {
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

	result := ResultOutput{
		OrgInfo:      orgInfo,
		Repositories: make(map[string]RepositoryInfoResult),
	}

	if reposInfo == nil {
		errors = append(errors, fmt.Errorf("no repository information found"))
		return errors
	}

	for _, repo := range *reposInfo {
		result.Repositories[repo.RepoName] = RepositoryInfoResult{
			RepoInfoResult:         repo,
			ContributionInfoResult: (*contributionInfo)[repo.RepoName],
		}
	}

	jsonData, err := json.Marshal(result)
	if err != nil {
		errors = append(errors, err)
		return errors
	}

	file, err := os.Create("who-metrics-ui/src/data/data.json")
	if err != nil {
		errors = append(errors, err)
		return errors
	}
	defer file.Close()

	_, err = file.Write(jsonData)
	if err != nil {
		errors = append(errors, err)
		return errors
	}

	fmt.Println("JSON data written to ", file.Name())

	return errors
}

type Fetchers struct {
	OrgInfo          *fetchers.OrgInfoFetcher
	ReposInfo        *fetchers.ReposInfoFetcher
	ContributionInfo *fetchers.ContributionInfoFetcher
}

func buildFetchers(client *githubv4.Client, organizationName string) Fetchers {
	fetchers := Fetchers{
		OrgInfo:          fetchers.NewOrgInfo(client, organizationName),
		ReposInfo:        fetchers.NewReposInfoFetcher(client, organizationName),
		ContributionInfo: fetchers.NewContributionInfoFetcher(client, organizationName),
	}

	return fetchers
}
