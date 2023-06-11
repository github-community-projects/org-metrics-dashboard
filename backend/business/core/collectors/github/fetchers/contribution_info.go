package fetchers

import (
	"context"
	"fmt"

	"github.com/shurcooL/githubv4"
)

type ContributionInfoFetcher struct {
	client  *githubv4.Client
	orgName string
}

func NewContributionInfoFetcher(client *githubv4.Client, orgName string) *ContributionInfoFetcher {
	return &ContributionInfoFetcher{client: client, orgName: orgName}
}

type contributionInfo struct {
	Node struct {
		NameWithOwner githubv4.String
		
	}
}

type contributionInfoQuery struct {
	Organization struct {
		Repositories struct {
			Edges    []contributionInfo
			PageInfo struct {
				EndCursor   githubv4.String
				HasNextPage bool
			}
		} `graphql:"repositories(first: 100, privacy: PUBLIC, after: $reposCursor)"`
	} `graphql:"organization(login:$organizationLogin)"`
}

func (c *ContributionInfoFetcher) Fetch(ctx context.Context) (string, error) {
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(c.orgName),
		"reposCursor":       (*githubv4.String)(nil), // Null after argument to get first page.
	}

	var q contributionInfoQuery

	var allRepos []contributionInfo

	for {
		err := c.client.Query(ctx, &q, variables)
		if err != nil {
			return "", err
		}
		allRepos = append(allRepos, q.Organization.Repositories.Edges...)
		if !q.Organization.Repositories.PageInfo.HasNextPage {
			break
		}
		variables["reposCursor"] = githubv4.NewString(q.Organization.Repositories.PageInfo.EndCursor)
	}

	csvString, err := c.formatCSV(allRepos)
	if err != nil {
		return "", err
	}
	return csvString, nil
}

func (f *ContributionInfoFetcher) formatCSV(data []contributionInfo) (string, error) {
	csvString := "repo_name,issues_opened\n"
	for _, edge := range data {
		csvString += fmt.Sprintf("%s\n",
			edge.Node.NameWithOwner,
			// edge.Node.OpenIssues.TotalCount,
			// edge.Node.ClosedIssues.TotalCount,
			// edge.Node.OpenPullRequests.TotalCount,
			// edge.Node.MergedPullRequests.TotalCount,
		)
	}
	return csvString, nil
}
