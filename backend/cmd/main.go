package main

import (
	"context"
	"log"

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
	githubCollector := github.NewGitHubCollector(c)
	core := core.New(githubCollector)

	results, errors := core.Amass(context.Background())
	log.Println(results)
	log.Println(errors)
	return nil
}
