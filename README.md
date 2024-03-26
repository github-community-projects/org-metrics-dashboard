# World Health Org Metrics Project

## Problem Statement

The World Health Organization leads global efforts to expand universal health coverage. They direct and coordinate the world’s response to health emergencies however there is currently no integrated digital environment for public health experts from all around the globe to collaborate on pandemic and epidemic intelligence and ongoing public health emergency events. The World Health Organization is exploring how to easily collaborate with external experts around the world to work on public health issues like COVID-19.

## Goal

Monitor open source health across different projects to have a high level view the best practices adopted by various open source projects to help build interest in open source work and advocate for more open source development

Issue Project [here](https://github.com/github/SI-skills-based-volunteering/issues/147#issuecomment-1472370039)

## Team

<table>
  <tr valign="top">
  <td align=center>
    <img src="https://avatars.githubusercontent.com/u/12959012?v=4" width="110" height="110"><br/>
      <a href="https://github.com/liliana3186">@liliana3186</a><br/>
     Liliana Torres<br/>
      <b>Project Lead, Senior Data Analyst </b>
    </td>
    <td align=center>
    <img src="https://avatars.githubusercontent.com/u/61184284?v=4" width="110" height="110"><br/>
      <a href="https://github.com/darostegui">@darostegui</a><br/>
      Diego Arostegui<br/>
      <b>Customer Reliability Engineer III</b>
    </td>
    <td align=center>
    <img src="https://avatars.githubusercontent.com/u/24923406?v=4" width="110" height="110"><br/>
      <a href="https://github.com/ajhenry">@ajhenry</a><br/>
      Andrew Henry<br/>
      <b>Senior Software Engineer </b>
    </td>
    <td align=center>
    <img src="https://github.com/ipc103.png?v=4" width="110" height="110"><br/>
      <a href="https://github.com/ipc103">@ipc103</a><br/>
      Ian Candy<br/>
      <b>Senior Software Engineer</b>
    </td>
    <td align=center>
    <img src="https://github.com/lehcar.png?v=4" width="110" height="110"><br/>
      <a href="https://github.com/lehcar">@lehcar</a><br/>
      Rachel Stanik<br/>
      <b>Software Engineer III</b>
    </td>
   </tr>
</table>

## Configuration

There is a `config.yml` located in the root of the project that contains the configuration for the project. The configuration is as follows:

```yaml
---
# The GitHub organization name
organization: 'YOUR_ORG_NAME'
# An ISO 8601 date string representing the date to start fetching data from
since: '2024-02-22'
```

This modifies the behavior of the fetcher to fetch data from the specified organization and since the specified date.

## Development

This project is split into two parts:

- **app**: the code for the frontend
- **backend**: the code for the backend and fetcher

Both are written in TypeScript. We use npm workspaces to manage the dependencies between the two projects.

### Prerequisites

- Node.js 20.X or later
- npm

### Environment Variables

You will need a `.env` file in the root of the project:

```sh
cp .env.example .env
```

The `GRAPHQL_TOKEN` token requires the following scopes:

- read:org
- read:repo
- read:project

> [!NOTE]
> To fetch collaborator counts, you need to provide a token that is an admin of the repository.

### Installation

```sh
npm i
```

### Running the monorepo

This will kick off both the fetcher and the app.

```sh
npm run dev
```

### Running each part separately

If you wish to run the backend only:

```sh
npm run dev:backend
```

If you wish to run the app only:

> Note that you need to provide a valid `data.json` file in the `app/src/data` directory in order to render the app.

```sh
npm run dev:app
```
