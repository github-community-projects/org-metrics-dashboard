# World Health Org Metrics Project 

## Goal

Monitor open source health across different projects to have a high level view the best practices adopted by various open source projects

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
   </tr>
</table>






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
