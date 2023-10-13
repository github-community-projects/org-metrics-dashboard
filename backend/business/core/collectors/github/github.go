package github

import (
	"context"
	"sync"

	"github.com/shurcooL/githubv4"
	"github.com/who-metrics/business/core/collectors/github/fetchers"
)

type Fetcher interface {
	Fetch(ctx context.Context) (string, error)
}

type Collector struct {
	fetchers []Fetcher
}

func NewGitHubCollector(client *githubv4.Client) *Collector {
	return &Collector{fetchers: buildFetchers(client)}
}

func (c *Collector) Collect(ctx context.Context) ([]string, []error) {
	var wg sync.WaitGroup

	results, errors := make([]string, 0), make([]error, 0)
	for _, fetcher := range c.fetchers {
		wg.Add(1)
		fetcher := fetcher
		go func() {
			defer wg.Done()
			var result, err = fetcher.Fetch(ctx)
			if err != nil {
				errors = append(errors, err)
			}
			if result != "" {
				results = append(results, result)
			}
		}()
	}
	wg.Wait()
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
	// TODO: map the fetchers to keys so we can easily access them
	return []Fetcher{
		fetchers.NewOrgInfo(client, "WorldHealthOrganization"),
		fetchers.NewReposInfoFetcher(client, "WorldHealthOrganization"),
		fetchers.NewContributionInfoFetcher(client, "WorldHealthOrganization"),
	}
}
