package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
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

		jsonData, err := formatJSON(q)

		if err != nil {
			return err
		}
		fmt.Println(jsonData)
	}
	return nil
}

// formatJSON formats data as JSON.
func formatJSON(data interface{}) (string, error) {
	buf := new(bytes.Buffer)
	enc := json.NewEncoder(buf)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	if err := enc.Encode(data); err != nil {
		return "", err
	}
	return fmt.Sprintf("%s", buf), nil
}
