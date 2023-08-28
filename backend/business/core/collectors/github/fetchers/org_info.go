package fetchers

import (
	"context"
	"fmt"

	"github.com/shurcooL/githubv4"
)

type OrgInfo struct {
	client  *githubv4.Client
	orgName string
}

type orgInfo struct {
	Login           githubv4.String
	Name            githubv4.String
	Description     githubv4.String
	CreatedAt       githubv4.DateTime
	MembersWithRole struct {
		TotalCount githubv4.Int
	}
	Projects struct {
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
}

type orgInfoQuery struct {
	Organization orgInfo `graphql:"organization(login:$organizationLogin)"`
}

func NewOrgInfo(client *githubv4.Client, orgName string) *OrgInfo {
	return &OrgInfo{client: client, orgName: orgName}
}

func (o *OrgInfo) Fetch(ctx context.Context) (string, error) {
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(o.orgName),
	}

	var q orgInfoQuery

	err := o.client.Query(ctx, &q, variables)
	if err != nil {
		return "", err
	}

	csvString, err := o.formatCSV(q.Organization)

	if err != nil {
		return "", err
	}
	return csvString, nil
}

func (f *OrgInfo) formatCSV(data orgInfo) (string, error) {
	csvString := "login,name,description,createdAt,totalMembers,totalProjects,totalRepositories,totalTeams\n"
	csvString += fmt.Sprintf("%s,%s,%s,%s,%d,%d,%d,%d\n",
		data.Login,
		data.Name,
		data.Description,
		data.CreatedAt,
		data.MembersWithRole.TotalCount,
		data.Projects.TotalCount+data.ProjectsV2.TotalCount,
		data.Repositories.TotalCount,
		data.Teams.TotalCount,
	)
	return csvString, nil
}
