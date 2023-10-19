## Contributing

**General Rules**

- As much as possible, try to follow the existing format of markdown and code.
- Don't forget to run `npm run lint` and `npm test` before submitting pull requests.
- Make sure that **100%** of your code is covered by tests.

**Contributing new features **

- To ensure that there are no conflicts when merging the branch into the main branch, 
- it is necessary to perform the following steps each time new development is going to be conducted on non-main branches:
- `git pull`, 
- `git rebase main`
- resolve conflicts before continuing the development.
- After new features developed
- `git add .`
- `git commit -m [rbtree] features` (`rbtree` needs to be replaced by the module you have modified, 
- `features` must be replaced by the detailed description about the features you implemented)
- `git push`
- click the `New pull request` on Github https://github.com/zrwusa/data-structure-typed/branches

**Contributing New Data Structures**

- Make your pull requests to be **specific** and **focused**. Instead of
  contributing "several data structures" all at once contribute them all
  one by one separately (i.e. one pull request for "RBTree", another one
  for "AATree" and so on).
- Provide **README.md** for each of the data structure **with explanations** of
  the algorithm and **with links** to further readings.
- Describe what you do in code using **comments**.
