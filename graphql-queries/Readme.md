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


CC: @hasan-dot
