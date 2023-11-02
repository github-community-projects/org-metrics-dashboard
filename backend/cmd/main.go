package main

import (
	"context"
	"log"
	"os"

	"github.com/who-metrics/business/core"
	"github.com/who-metrics/business/core/collectors/github"
	"github.com/who-metrics/business/helpers"
)

func main() {
	err := run()
	if err != nil {
		log.Println(err)
	}
}

func run() error {
	// GitHub GraphQL API v4 token.
	c := helpers.NewGHGraphQLClient()
	org := os.Getenv("ORGANIZATION_NAME")
	if org == "" {
		org = "sbv-world-health-org-metrics"
	}
	githubCollector := github.NewGitHubCollector(c, org)
	core := core.New(githubCollector)

	errors := core.Amass(context.Background())

	// We should really retry on error, and preserve the data we've already collected
	// TODO: maybe fix this?
	if len(errors) > 0 {
		// print every error in the errors array
		for _, err := range errors {
			log.Println(err)
		}
		panic(errors)
	}

	return nil
}
