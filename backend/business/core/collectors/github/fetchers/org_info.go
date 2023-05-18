package fetchers

import (
	"context"

	"github.com/shurcooL/githubv4"
	"github.com/who-metrics/business/helpers"
)

type OrgInfo struct {
	client  *githubv4.Client
	orgName string
}

func NewOrgInfo(client *githubv4.Client, orgName string) *OrgInfo {
	return &OrgInfo{client: client, orgName: orgName}
}

func (f *OrgInfo) Fetch(ctx context.Context) (string, error) {
	var q struct {
		Organization struct {
			Login           githubv4.String
			Name            githubv4.String
			Description     githubv4.String
			IsVerified      githubv4.Boolean
			CreatedAt       githubv4.DateTime
			MembersWithRole struct {
				TotalCount githubv4.Int
			}
			Projects struct {
				TotalCount githubv4.Int
			}
			EnterpriseOwners struct {
				TotalCount githubv4.Int
			}
			ProjectsV2 struct {
				TotalCount githubv4.Int
			}
			Repositories struct {
				TotalCount githubv4.Int
			}
			Teams struct {
				TotalCount githubv4.Int
			}
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
