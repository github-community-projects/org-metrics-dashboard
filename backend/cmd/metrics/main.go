package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

func main() {
	err := run()
	if err != nil {
		log.Println(err)
	}
}

func run() error {
	src := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: os.Getenv("GITHUB_GRAPHQL_TOKEN")},
	)
	httpClient := oauth2.NewClient(context.Background(), src)
	client := githubv4.NewClient(httpClient)

	{
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
			"organizationLogin": githubv4.String("WorldHealthOrganization"),
		}
		err := client.Query(context.Background(), &q, variables)
		if err != nil {
			return err
		}
		printJSON(q)

	}
	return nil
}

// printJSON prints v as JSON encoded with indent to stdout. It panics on any error.
func printJSON(v interface{}) {
	w := json.NewEncoder(os.Stdout)
	w.SetIndent("", "\t")
	err := w.Encode(v)
	if err != nil {
		panic(err)
	}
}
