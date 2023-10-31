package fetchers

import (
	"context"
	"fmt"

	"github.com/shurcooL/githubv4"
)

type OrgInfoFetcher struct {
	client  *githubv4.Client
	orgName string
}

type OrgInfoResult struct {
	Login                string `json:"login"`
	Name                 string `json:"name"`
	Description          string `json:"description"`
	CreatedAt            string `json:"createdAt"`
	MembersWithRoleCount int    `json:"membersWithRoleCount"`
	ProjectsCount        int    `json:"projectsCount"`
	ProjectsV2Count      int    `json:"projectsV2Count"`
	RepositoriesCount    int    `json:"repositoriesCount"`
	TeamsCount           int    `json:"teamsCount"`
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

func NewOrgInfo(client *githubv4.Client, orgName string) *OrgInfoFetcher {
	return &OrgInfoFetcher{client: client, orgName: orgName}
}

func (oif *OrgInfoFetcher) Fetch(ctx context.Context) (*OrgInfoResult, error) {
	variables := map[string]interface{}{
		"organizationLogin": githubv4.String(oif.orgName),
	}

	var q orgInfoQuery

	err := oif.client.Query(ctx, &q, variables)
	if err != nil {
		return nil, err
	}

	result := oif.buildResult(q.Organization)

	if err != nil {
		return result, err
	}
	return result, nil
}

func (f *OrgInfoFetcher) formatCSV(data orgInfo) (string, error) {
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

func (f *OrgInfoFetcher) buildResult(data orgInfo) *OrgInfoResult {
	return &OrgInfoResult{
		Login:                string(data.Login),
		Name:                 string(data.Name),
		Description:          string(data.Description),
		CreatedAt:            data.CreatedAt.Format("2006-01-02T15:04:05-0700"),
		MembersWithRoleCount: int(data.MembersWithRole.TotalCount),
		ProjectsCount:        int(data.Projects.TotalCount),
		ProjectsV2Count:      int(data.ProjectsV2.TotalCount),
		RepositoriesCount:    int(data.Repositories.TotalCount),
		TeamsCount:           int(data.Teams.TotalCount),
	}
}
