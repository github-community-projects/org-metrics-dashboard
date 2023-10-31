package main

import (
	"context"
	"flag"
	"fmt"
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

	results, errors := core.Amass(context.Background())

	// We should really retry on error, and preserve the data we've already collected
	// TODO: maybe fix this?
	if len(errors) > 0 {
		// panic(errors)
	}

	if (format == "csv") && (len(results) > 0) {
		fmt.Println(results)
		fmt.Println(errors)
		return nil
	}

	if (format == "json") && (len(results) > 0) {
		output, err := helpers.FormatJSON(results)
		if err != nil {
			return err
		}

		fmt.Println(output)
		return nil
	}

	return nil
}
