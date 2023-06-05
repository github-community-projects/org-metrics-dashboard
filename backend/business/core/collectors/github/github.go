package github

import (
	"context"

	"github.com/shurcooL/githubv4"
	"github.com/who-metrics/business/core/collectors/github/fetchers"
)

type Fetcher interface {
	Fetch(ctx context.Context) (string, error)
}

type GitHubCollector struct {
	fetchers []Fetcher
}

func NewGitHubCollector(client *githubv4.Client) *GitHubCollector {
	return &GitHubCollector{fetchers: buildFetchers(client)}
}

func (c *GitHubCollector) Collect(ctx context.Context) ([]string, []error) {
	// TODO: process with goroutines
	results, errors := make([]string, len(c.fetchers)), make([]error, len(c.fetchers))
	for _, fetcher := range c.fetchers {
		result, err := fetcher.Fetch(ctx)
		if err != nil {
			errors = append(errors, err)
		}
		results = append(results, result)
	}
	return results, errors
}

func buildFetchers(client *githubv4.Client) []Fetcher {
	// TODO:
	// load all variables from env or somewhere else
	// it should look something like this:
	/*
		vars := GetVars()
		return []Fetcher{
			&fetchers.OrgInfo{client: client, orgName: vars.orgName},
		}
	*/
	return []Fetcher{
		// fetchers.NewOrgInfo(client, "WorldHealthOrganization"),
		fetchers.NewCollaboratorsPerRepo(client, "WorldHealthOrganization"),
		// fetchers.NewOrgReposInfo(client, "WorldHealthOrganization"),
	}
}
