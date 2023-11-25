## Contributing

**General Rules**

- As much as possible, try to follow the existing format of markdown and code.
- Don't forget to run `npm run check`,`npm run lint` and `npm test` before submitting pull requests.
- Make sure that **100%** of your code is covered by tests.

**Conventional Commits**
<table>
  <tr>
    <th>Identifier</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>feat</td>
    <td>Introduce a new feature</td>
  </tr>
  <tr>
    <td>fix</td>
    <td>Fix an error or defect</td>
  </tr>
  <tr>
    <td>chore</td>
    <td>General maintenance tasks (e.g., build, configuration, dependencies)</td>
  </tr>
  <tr>
    <td>docs</td>
    <td>Documentation changes (additions, updates, fixes)</td>
  </tr>
  <tr>
    <td>style</td>
    <td>Changes in code style, formatting, whitespace, etc. (no impact on functionality)</td>
  </tr>
  <tr>
    <td>refactor</td>
    <td>Code refactoring (typically, no functional changes)</td>
  </tr>
  <tr>
    <td>perf</td>
    <td>Performance optimizations</td>
  </tr>
  <tr>
    <td>test</td>
    <td>Changes related to tests (additions, updates, fixes)</td>
  </tr>
  <tr>
    <td>build</td>
    <td>Changes to the build system or external dependencies</td>
  </tr>
  <tr>
    <td>ci</td>
    <td>Changes related to continuous integration and deployment (CI/CD)</td>
  </tr>
  <tr>
    <td>revert</td>
    <td>Revert a previous commit</td>
  </tr>
  <tr>
    <td>merge</td>
    <td>Merge branches or pull requests</td>
  </tr>
  <tr>
    <td>release</td>
    <td>Commits related to version releases</td>
  </tr>
</table>

**Contributing new features**

- To ensure that there are no conflicts when merging the branch into the main branch,
- it is necessary to perform the following steps each time new development is going to be conducted on non-main
  branches:
- `git pull`,
- `git rebase main`
- resolve conflicts before continuing the development.
- After new features developed
- `git add .`
- `git commit -m "feat(rbtree): features`
- `feat(rbtree):` needs to be replaced by the module you have modified
- `features` must be replaced by the detailed description about the features you implemented
- `git push`
- click the `New pull request` on Github https://github.com/zrwusa/data-structure-typed/branches

**Contributing New Data Structures**

- Make your pull requests to be **specific** and **focused**. Instead of
  contributing "several data structures" all at once contribute them all
  one by one separately (i.e. one pull request for "RBTree", another one
  for "AATree" and so on).
- Modify **README.md** for each of the data structure **with explanations** of
  the algorithm and **with links** to further readings.
- Describe what you do in code using **comments**.
