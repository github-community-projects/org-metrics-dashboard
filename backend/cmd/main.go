package main

import (
	"context"
	"flag"
	"log"

	"github.com/who-metrics/business/core"
	"github.com/who-metrics/business/core/collectors/github"
	"github.com/who-metrics/business/helpers"
)

func main() {
	formatPtr := flag.String("format", "csv", "Format of the output file: csv or json")

	if (*formatPtr != "csv") && (*formatPtr != "json") {
		log.Fatal("Invalid format flag")
	}

	err := run(*formatPtr)
	if err != nil {
		log.Println(err)
	}
}

func run(format string) error {
	// GitHub GraphQL API v4 token.
	c := helpers.NewGHGraphQLClient()
	githubCollector := github.NewGitHubCollector(c, "sbv-world-health-org-metrics")
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
