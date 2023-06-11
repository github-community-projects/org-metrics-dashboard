package fetchers

import (
	"context"
	"fmt"

	"github.com/shurcooL/githubv4"
)

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
		} `graphql:"repositories(first: 100, privacy: PUBLIC, after: $reposCursor)"`
	} `graphql:"organization(login:$organizationLogin)"`
}

func (f *ReposInfoFetcher) Fetch(ctx context.Context) (string, error) {
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(f.orgName),
		"reposCursor":       (*githubv4.String)(nil), // Null after argument to get first page.
	}

	var q reposInfoQuery

	var allRepos []repoInfo

	for {
		err := f.client.Query(ctx, &q, variables)
		if err != nil {
			return "", err
		}
		allRepos = append(allRepos, q.Organization.Repositories.Edges...)
		if !q.Organization.Repositories.PageInfo.HasNextPage {
			break
		}
		variables["reposCursor"] = githubv4.NewString(q.Organization.Repositories.PageInfo.EndCursor)
	}

	csvString, err := f.formatCSV(allRepos)
	if err != nil {
		return "", err
	}
	return csvString, nil
}

func (f *ReposInfoFetcher) formatCSV(data []repoInfo) (string, error) {
	csvString := "repo_name,collaborators_count,projects_count,discussions_count,forks_count,issues_count,licenseInfo,watchers_count\n"
	for _, edge := range data {
		csvString += fmt.Sprintf("%s,%d,%d,%d,%d,%d,%s,%d\n",
			edge.Node.NameWithOwner,
			edge.Node.Collaborators.TotalCount,
			edge.Node.Projects.TotalCount+edge.Node.ProjectsV2.TotalCount,
			edge.Node.Discussions.TotalCount,
			edge.Node.Forks.TotalCount,
			edge.Node.Issues.TotalCount,
			edge.Node.LicenseInfo.Name,
			edge.Node.Watchers.TotalCount,
		)
	}
	return csvString, nil
}
