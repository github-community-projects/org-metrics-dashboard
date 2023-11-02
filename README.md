# World Health Org Metrics Project 

## Problem Statement

The World Health Organization leads global efforts to expand universal health coverage. They direct and coordinate the world’s response to health emergencies however there is currently no integrated digital environment for public health experts from all around the globe to collaborate on pandemic and epidemic intelligence and ongoing public health emergency events. The World Health Organization is exploring how to easily collaborate with external experts around the world to work on public health issues like COVID-19.

## Goal

Monitor open source health across different projects to have a high level view the best practices adopted by various open source projects to help build interest in open source work and advocate for more open source development

Issue Project  [here](https://github.com/github/SI-skills-based-volunteering/issues/147#issuecomment-1472370039)


## Team
<table>
  <tr>
  <td colspan=3 align=center>
    <img src="https://avatars.githubusercontent.com/u/12959012?v=4" width="110" height="110"><br/><br/>
      <a href="https://github.com/liliana3186">@liliana3186</a><br/>
     </b>Liliana Torres<br>
      <b>Project Lead, Senior Data Analyst </b>
    </td>
    <td colspan=3 align=center>
    <img src="https://avatars.githubusercontent.com/u/34780972?v=4 width="110" height="110" ><br/>
      <a href="https://github.com/hasan-dot">@hasan-dot</a><br/>
      </b>Hassan Hawache<br>
      <b> Sofware Engineer III</b>
    </td>
    <td colspan=3 align=center>
    <img src="https://avatars.githubusercontent.com/u/61184284?v=4" width="110" height="110"><br/>
      <a href="https://github.com/darostegui">@daristegui</a><br/>
      </b>Diego Arostegui<br>
      <b>Customer Reliability Engineer III</b>
    </td>
    <td colspan=3 align=center>
    <img src="https://avatars.githubusercontent.com/u/24923406?v=4" width="110" height="110"><br/>
      <a href="https://github.com/ajhenry">@ajhenry</a><br/>
      </b>Andrew Henry<br>
      <b> Senior Software Engineer </b>
    </td>
    <td colspan=3 align=center>
    <img src="https://avatars.githubusercontent.com/u/67866556?v=4" width="110" height="110"><br/>
      <a href="https://github.com/joannaakl">@joannaakl</a><br/>
      </b>Joanna Krzek-Lubowiecka<br>
      <b> Software Engineer III </br>
    </td>
    <td colspan=3 align=center>
    <img src="https://avatars.githubusercontent.com/u/22037769?v=4 width="110" height="110"><br/>
      <a href="https://github.com/dmgardiner25">@dmgardiner25</a><br/>
      </b>David Gardiner<br>
      <b> Software Engineer II</b>
    </td>
    <td colspan=3 align=center>
    <img src="https://github.com/ipc103.png?v=4" width="110" height="110"><br/>
      <a href="https://github.com/ipc103">@ipc103</a><br/>
      </b>Ian Candy<br>
      <b> Senior Software Engineer</b>
    </td>
   </tr>
</table>






## Development in Codespaces

### UI

1. Run `cd who-metrics-ui && npm i`
2. Run `npm run dev`

<!-- TODO: Add min requirements and deployment steps -->
### Backend

To update the repository data.

1. Generate a [new GitHub Token](https://github.com/settings/tokens) with the ability to read repo and projects.
2. Run the following command from the root of the repository
```
make build
./backend/bin/metrics
```

This will generate a new `data.json` file in the UI directory which can be imported directly as part of the static build.