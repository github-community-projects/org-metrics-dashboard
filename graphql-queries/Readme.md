Adding Sample GraphQl queries and testing using [GraphQl Explorer](https://docs.github.com/en/graphql/overview/explorer):

Getting Basic Information of the organization:

```
{
  organization(login: "WorldHealthOrganization") {
    login
    name
    description
    isVerified
    createdAt
    membersWithRole {
      totalCount
    }
    projects {
      totalCount
    }
    enterpriseOwners {
      totalCount
    }
    projectsV2 {
      totalCount
    }
    repositories {
      totalCount
    }
    teams {
      totalCount
    }

  }
}
```

Collaborators

```
{
  organization(login: "WorldHealthOrganization") {
    repositories(first: 100) {
      edges {
        node {
          name
          collaborators {
           totalCount
          }
        }
      }
    }
  }
}
```

Repository Information (including License type)

```
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
```
Looking for :bugs: 

```
{
  organization(login: "githubcustomers") {
    name
    repositories(first: 100) {
      edges {
        node {
          issues(labels: "bug", first: 100) {
            edges {
              node {
                id
                url
              }
            }
          }
        }
      }
    }
  }
}
```
CC: @hasan-dot
