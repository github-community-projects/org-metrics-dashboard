# World Health Org Metrics Project 

## Goal

Monitor open source health across different projects to have a high level view the best practices adopted by various open source projects

Issue Project  [here](https://github.com/github/SI-skills-based-volunteering/issues/147#issuecomment-1472370039)

### Members

@darostegui
@hasan-dot

## Development in Codespaces

### UI

1. Run `cd who-metrics-ui && npm i`
2. Run `npm run dev`

<!-- TODO: Add min requirements and deployment steps -->
### Backend
Run the following command to run the action locally
```
gh act -W .github/workflows/graphql.yml  --artifact-server-path ./tmp/ --env-file dev.vscode.env
```