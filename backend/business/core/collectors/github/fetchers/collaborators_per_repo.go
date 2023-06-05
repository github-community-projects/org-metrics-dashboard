package fetchers

import (
	"context"
	"fmt"

	"github.com/shurcooL/githubv4"
)

type CollaboratorsPerRepo struct {
	client  *githubv4.Client
	orgName string
}

type RepoCollaboratorsInfo struct {
	Node struct {
		Name          githubv4.String
		Collaborators struct {
			TotalCount githubv4.Int
		}
	}
}

func NewCollaboratorsPerRepo(client *githubv4.Client, orgName string) *CollaboratorsPerRepo {
	return &CollaboratorsPerRepo{client: client, orgName: orgName}
}

type collaboratorsQuery struct {
	Organization struct {
		Repositories struct {
			Edges    []RepoCollaboratorsInfo
			PageInfo struct {
				EndCursor   githubv4.String
				HasNextPage bool
			}
		} `graphql:"repositories(first: 100, after: $reposCursor)"`
	} `graphql:"organization(login:$organizationLogin)"`
}

func (f *CollaboratorsPerRepo) Fetch(ctx context.Context) (string, error) {
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(f.orgName),
		"reposCursor":       (*githubv4.String)(nil), // Null after argument to get first page.
	}

	var q collaboratorsQuery

	var allRepos []RepoCollaboratorsInfo

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

func (f *CollaboratorsPerRepo) formatCSV(data []RepoCollaboratorsInfo) (string, error) {
	csvString := "repo_name,collaborators_count\n"
	for _, edge := range data {
		csvString += fmt.Sprintf("%s,%d\n", edge.Node.Name, edge.Node.Collaborators.TotalCount)
	}
	return csvString, nil
}
