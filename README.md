# PMM tree test — setup

Three files do everything: `index.html` (the study participants see), `logo.svg` (the PMM logo it displays) and `apps-script.gs` (saves each response to a Google Sheet you own). About an hour, no coding.

## 1. Try it locally first (2 min)
Double-click `index.html`. It opens in your browser in **test mode**: no saving, results shown as text on the last screen. Click through once to check copy and tree labels. Edit anything in the CONFIGURATION block at the top of the file with a plain text editor.

## 2. Create the results sheet (10 min)
1. Create a new Google Sheet, name it e.g. "PMM tree test responses".
2. Extensions → Apps Script. Delete what's there, paste the contents of `apps-script.gs`, save.
3. Deploy → New deployment → gear icon → Web app.
   - Description: anything
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when asked (it's your own script writing to your own sheet).
5. Copy the **Web app URL** (ends in `/exec`).
6. Open `index.html`, find `const ENDPOINT = "";` near the top and paste the URL between the quotes. Save.

Any time you change the script, you must Deploy → Manage deployments → pencil icon → Version: New version → Deploy, otherwise the old one keeps running. Opening the `/exec` URL in a browser should show "PMM tree test endpoint is running."

## 3. Put it online (15 min)
Any static host works. GitHub Pages is free:
1. Create a new repository (private is fine for the repo, Pages will still be public), e.g. `pmm-tree-test`.
2. Upload `index.html` and `logo.svg` together (drag and drop in the GitHub web UI). They must sit in the same folder.
3. Settings → Pages → Source: Deploy from a branch → `main` / root → Save.
4. After a minute the URL appears at the top of that page, like `https://<you>.github.io/pmm-tree-test/`.

Don't upload `apps-script.gs` or this README to the repo; participants don't need them.

## 4. One link per channel
Same page, different tag. The tag lands in the `src` column so you can split results by audience.
- Slack: `https://<you>.github.io/pmm-tree-test/?src=slack`
- Forum: `…/?src=forum`
- Customers: `…/?src=customer`

## 5. Test end to end
Open your link, complete the study once. A row should appear in the sheet within a few seconds. Delete that row before you post the link. To retake it yourself, open the link in a private window (the page remembers completion per browser).

## What's recorded
One row per participant in the `Responses` tab: role, PMM versions, the three post-test answers, and for each task (columns `T1_…` to `T7_…`, always in that order): outcome (`direct`, `indirect`, `direct-fail`, `indirect-fail`, `skipped`), chosen destination, number of back-steps, seconds, the order it was shown in, and the full click path. The last column holds the raw submission as a safety copy. If a submission cannot be parsed it lands in an `Errors` tab instead of being lost.

## Reading results
When you're done, share the sheet (or paste the CSV) into this chat and I'll compute success %, direct %, and top failure paths per task, split by audience and PMM version, against the pass marks (70% success / 50% direct).

## How the tree is shaped
- **Search** is not a node. Tree tests measure browsing; search would let people bypass the structure being tested.
- **My navigation** simulates a participant who has already pinned three pages: MongoDB backups, MySQL InnoDB details and PostgreSQL query analytics. The first and last are accepted answers for tasks 1 and 2; MySQL InnoDB details is a distractor that no task accepts, so expect those two tasks to score higher than the rest and compare them with care.
- **Technology hub pages** (MongoDB, MySQL, PostgreSQL, Valkey, Operating system) are leaf pages. The concept being tested is a hub that summarises what is happening and links to the relevant tools and actions, so a hub counts as correct for technology-scoped tasks (1, 2, 3 and 5).
- **Account** lists only real pages. Actions such as switching theme and signing out are left out because they are not destinations.

## Participant flow
- Participants can go back and edit answers on the questions before and after the tasks. Their earlier answers are restored.
- Tasks are one-way. Once a task is answered it cannot be revisited, because the path, back-steps and timing measure the first attempt.
- The "Not sure where I'd go" button records the task as `skipped`.

## Changing tasks or tree later
Edit `TREE`, `TASKS`, `PRE`, `POST` or `COPY` in `index.html`. If you change the tree or tasks after responses have started coming in, change `STUDY.id` too so old and new responses don't mix.
