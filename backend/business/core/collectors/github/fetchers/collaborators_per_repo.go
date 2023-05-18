package fetchers

import (
	"context"

	"github.com/shurcooL/githubv4"
	"github.com/who-metrics/business/helpers"
)

type CollaboratorsPerRepo struct {
	client  *githubv4.Client
	orgName string
}

func NewCollaboratorsPerRepo(client *githubv4.Client, orgName string) *CollaboratorsPerRepo {
	return &CollaboratorsPerRepo{client: client, orgName: orgName}
}

func (f *CollaboratorsPerRepo) Fetch(ctx context.Context) (string, error) {
	var q struct {
		Organization struct {
			Repositories struct {
				Edges []struct {
					Node struct {
						Name          githubv4.String
						Collaborators struct {
							TotalCount githubv4.Int
						}
					}
				}
			} `graphql:"repositories(first:100)"`
		} `graphql:"organization(login:$organizationLogin)"`
	}
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(f.orgName),
	}

	err := f.client.Query(ctx, &q, variables)
	if err != nil {
		return "", err
	}

	jsonData, err := helpers.FormatJSON(q)

	if err != nil {
		return "", err
	}
	return jsonData, nil
}
