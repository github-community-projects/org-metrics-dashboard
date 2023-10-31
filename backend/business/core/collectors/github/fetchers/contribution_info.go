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

type ContributionInfoResult struct {
	RepositoryName string `json:"repositoryName"`
}

func NewContributionInfoFetcher(client *githubv4.Client, orgName string) *ContributionInfoFetcher {
	return &ContributionInfoFetcher{client: client, orgName: orgName}
}

type contributionInfo struct {
	Node struct {
		NameWithOwner githubv4.String
		Name          githubv4.String
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

func (c *ContributionInfoFetcher) Fetch(ctx context.Context) (*map[string]ContributionInfoResult, error) {
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(c.orgName),
		"reposCursor":       (*githubv4.String)(nil), // Null after argument to get first page.
	}

	var q contributionInfoQuery

	var allRepos []contributionInfo

	for {
		err := c.client.Query(ctx, &q, variables)
		if err != nil {
			return nil, err
		}
		allRepos = append(allRepos, q.Organization.Repositories.Edges...)
		if !q.Organization.Repositories.PageInfo.HasNextPage {
			break
		}
		variables["reposCursor"] = githubv4.NewString(q.Organization.Repositories.PageInfo.EndCursor)
	}

	result := c.buildResult(allRepos)
	return result, nil
}

// FormatCSV formats the given data as CSV
func (f *ContributionInfoFetcher) FormatCSV(data []contributionInfo) (string, error) {
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

func (f *ContributionInfoFetcher) buildResult(data []contributionInfo) *map[string]ContributionInfoResult {
	result := make(map[string]ContributionInfoResult)
	for _, edge := range data {
		result[string(edge.Node.NameWithOwner)] = ContributionInfoResult{
			RepositoryName: string(edge.Node.Name),
			// CollaboratorsCount: edge.Node.Collaborators.TotalCount,
			// ProjectsCount:      edge.Node.Projects.TotalCount + edge.Node.ProjectsV2.TotalCount,
			// DiscussionsCount:   edge.Node.Discussions.TotalCount,
			// ForksCount:         edge.Node.Forks.TotalCount,
			// IssuesCount:        edge.Node.Issues.TotalCount,
			// OpenIssuesCount:    edge.Node.OpenIssues.TotalCount,
			// ClosedIssuesCount:  edge.Node.ClosedIssues.TotalCount,
			// OpenPRsCount:       edge.Node.OpenPullRequests.TotalCount,
			// MergedPRsCount:     edge.Node.MergedPullRequests.TotalCount,
			// LicenseName:        edge.Node.LicenseInfo.Name,
			// WatchersCount:      edge.Node.Watchers.TotalCount,
		}
	}
	return &result
}
