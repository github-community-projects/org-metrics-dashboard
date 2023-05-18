package fetchers

import (
	"context"

	"github.com/shurcooL/githubv4"
	"github.com/who-metrics/business/helpers"
)

type OrgReposInfo struct {
	client  *githubv4.Client
	orgName string
}

func NewOrgReposInfo(client *githubv4.Client, orgName string) *OrgReposInfo {
	return &OrgReposInfo{client: client, orgName: orgName}
}

func (f *OrgReposInfo) Fetch(ctx context.Context) (string, error) {
	/*
		{
		  organization(login: "WorldHealthOrganization") {
		    repositories(first: 100) {
		      edges {
		        node {
		          collaborators {
		            totalCount
		          }
		          nameWithOwner
		          projects {
		            totalCount
		          }
		          projectsV2 {
		            totalCount
		          }
		          discussions {
		            totalCount
		          }
		          forks {
		            totalCount
		          }
		          isPrivate
		          issues {
		            totalCount
		          }
		          licenseInfo {
		            name
		          }
		          watchers {
		            totalCount
		          }
		        }
		      }
		    }
		  }
		}
	*/
	var q struct {
		Organization struct {
			Repositories struct {
				Edges []struct {
					Node struct {
						NameWithOwner githubv4.String
						IsPrivate     githubv4.Boolean
						LicenseInfo   struct {
							Name githubv4.String
						}
						Watchers struct {
							TotalCount githubv4.Int
						}
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
