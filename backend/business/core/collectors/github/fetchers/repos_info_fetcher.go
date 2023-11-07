package fetchers

import (
	"context"
	"fmt"

	"github.com/shurcooL/githubv4"
)

type RepoInfoResult struct {
	RepoName                string `json:"repoName"`
	CollaboratorsCount      int    `json:"collaboratorsCount"`
	ProjectsCount           int    `json:"projectsCount"`
	DiscussionsCount        int    `json:"discussionsCount"`
	ForksCount              int    `json:"forksCount"`
	IssuesCount             int    `json:"issuesCount"`
	OpenIssuesCount         int    `json:"openIssuesCount"`
	ClosedIssuesCount       int    `json:"closedIssuesCount"`
	OpenPullRequestsCount   int    `json:"openPullRequestsCount"`
	MergedPullRequestsCount int    `json:"mergedPullRequestsCount"`
	LicenseName             string `json:"licenseName"`
	WatchersCount           int    `json:"watchersCount"`
}

type ReposInfoFetcher struct {
	client  *githubv4.Client
	orgName string
}

func NewReposInfoFetcher(client *githubv4.Client, orgName string) *ReposInfoFetcher {
	return &ReposInfoFetcher{client: client, orgName: orgName}
}

type repoInfo struct {
	Node struct {
		NameWithOwner githubv4.String
		Collaborators struct {
			TotalCount githubv4.Int
		}
		Projects struct {
			TotalCount githubv4.Int
		}
		ProjectsV2 struct {
			TotalCount githubv4.Int
		}
		Discussions struct {
			TotalCount githubv4.Int
		}
		Forks struct {
			TotalCount githubv4.Int
		}
		Issues struct {
			TotalCount githubv4.Int
		}
		OpenIssues struct {
			TotalCount githubv4.Int
		} `graphql:"openIssues: issues(states: OPEN)"`
		ClosedIssues struct {
			TotalCount githubv4.Int
		} `graphql:"closedIssues: issues(states: CLOSED)"`
		OpenPullRequests struct {
			TotalCount githubv4.Int
		} `graphql:"openPullRequests: pullRequests(states: OPEN)"`
		MergedPullRequests struct {
			TotalCount githubv4.Int
		} `graphql:"mergedPullRequests: pullRequests(states: MERGED)"`
		LicenseInfo struct {
			Name githubv4.String
		}
		Watchers struct {
			TotalCount githubv4.Int
		}
	}
}

type reposInfoQuery struct {
	Organization struct {
		Repositories struct {
			Edges    []repoInfo
			PageInfo struct {
				EndCursor   githubv4.String
				HasNextPage bool
			}
		} `graphql:"repositories(first: 20, privacy: PUBLIC, after: $reposCursor)"`
	} `graphql:"organization(login:$organizationLogin)"`
}

// Fetch fetches the repos info for the given organization
func (f *ReposInfoFetcher) Fetch(ctx context.Context) (*map[string]RepoInfoResult, error) {
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(f.orgName),
		"reposCursor":       (*githubv4.String)(nil), // Null after argument to get first page.
	}

	var q reposInfoQuery

	var allRepos []repoInfo

	for {
		err := f.client.Query(ctx, &q, variables)

		if err != nil {
			return nil, fmt.Errorf("failed to fetch repos info for %s: %s", f.orgName, err.Error())
		}
		allRepos = append(allRepos, q.Organization.Repositories.Edges...)
		if !q.Organization.Repositories.PageInfo.HasNextPage {
			break
		}
		variables["reposCursor"] = githubv4.NewString(q.Organization.Repositories.PageInfo.EndCursor)
	}

	result := f.buildResult(allRepos)
	return result, nil
}

func (f *ReposInfoFetcher) buildResult(data []repoInfo) *map[string]RepoInfoResult {
	holder := make(map[string]RepoInfoResult)
	for _, edge := range data {
		holder[string(edge.Node.NameWithOwner)] = RepoInfoResult{
			RepoName:                string(edge.Node.NameWithOwner),
			CollaboratorsCount:      int(edge.Node.Collaborators.TotalCount),
			ProjectsCount:           int(edge.Node.Projects.TotalCount + edge.Node.ProjectsV2.TotalCount),
			DiscussionsCount:        int(edge.Node.Discussions.TotalCount),
			ForksCount:              int(edge.Node.Forks.TotalCount),
			IssuesCount:             int(edge.Node.Issues.TotalCount),
			OpenIssuesCount:         int(edge.Node.OpenIssues.TotalCount),
			ClosedIssuesCount:       int(edge.Node.ClosedIssues.TotalCount),
			OpenPullRequestsCount:   int(edge.Node.OpenPullRequests.TotalCount),
			MergedPullRequestsCount: int(edge.Node.MergedPullRequests.TotalCount),
			LicenseName:             string(edge.Node.LicenseInfo.Name),
			WatchersCount:           int(edge.Node.Watchers.TotalCount),
		}
	}

	return &holder
}
