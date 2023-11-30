package helpers

import (
	"bytes"
	"context"
	"encoding/json"
	"os"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

// FormatJSON formats data as JSON.
func FormatJSON(data interface{}) (string, error) {
	buf := new(bytes.Buffer)
	enc := json.NewEncoder(buf)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	if err := enc.Encode(data); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func NewGHGraphQLClient() *githubv4.Client {
	if os.Getenv("GRAPHQL_TOKEN") == "" {
		panic("GRAPHQL_TOKEN environment variable is not set")
	}

	src := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: os.Getenv("GRAPHQL_TOKEN")},
	)
	httpClient := oauth2.NewClient(context.Background(), src)
	return githubv4.NewClient(httpClient)
}
