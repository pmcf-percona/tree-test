# Example: PMM navigation study

The configuration of the study this template was first built for: the main menu (left sidebar) of Percona Monitoring and Management, a database monitoring web app. Six tasks, two questions before, three after, and a simulated "My navigation" section of pinned pages.

`config.js` holds only the configuration blocks. There is no endpoint, no results and nothing that runs on its own.

## How to use it

1. Open `index.html` from the root of this repository in a text editor.
2. In the CONFIGURATION section, replace the `STUDY`, `TREE`, `PINNED`, `TASKS`, `PRE`, `POST` and `COPY` blocks with the ones from `config.js`.
3. Set `ENDPOINT` to your own Google Apps Script URL (see the main README), or leave it empty to try it in test mode.
4. `STUDY.logo` points to `logo.svg`. Replace that file with the product logo, or set `logo` to `""`.

## Why the tree is shaped this way

- **Search is not a node.** Tree tests measure browsing; search would let people bypass the structure being tested.
- **My navigation** simulates a participant who has already pinned three pages. Two of them are accepted answers (tasks 1 and 2). "MySQL InnoDB details" is a distractor that no task accepts. Expect tasks 1 and 2 to score higher than the rest, and compare them with care.
- **Technology hub pages** are leaves. The concept under test is a summary page that links onwards, so a hub counts as correct for technology-scoped tasks (1, 2, 3 and 5).
- **Account** lists only real pages. Actions such as switching theme and signing out are left out because they are not destinations.
- **T7** (commented out) is a "muscle memory" probe: it accepts the whole `Advisors` branch with `deep: true`.
