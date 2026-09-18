# Tree test template

A free, self-hosted tree test in a single HTML file. Participants navigate a text-only version of your menu, command structure or site map and pick where they would find things. Their answers land in a Google Sheet you own. No accounts, no servers, no cost.

## What is a tree test?

A tree test checks whether people can find things in your navigation when it is stripped of all visual design: just the labels and the hierarchy. You give participants a handful of realistic tasks ("Where would you go to restore yesterday's backup?") and record where they click.

Suggestion: Use one before redesigning a menu, when adding a new section and you are not sure where it belongs, or to compare two proposed structures before building either. Costs very little and will help expand horizons.

## Try the demo (30 seconds)

Open [the demo from this repo](https://pmcf-percona.github.io/tree-test/) and click through. The demo tests the command structure of "KeepSafe", a made-up command-line backup tool, with four tasks. Nothing is saved; the last screen shows exactly what would have been recorded.

To try it on your own computer, download the repository and double-click `index.html`. It opens in your browser in **test mode**.

## What you get

Three files do everything:

- `index.html`: the study participants see. All settings are in the CONFIGURATION block at the top of the file.
- `logo.svg`: an optional logo shown above the study. Replace it with yours or switch it off.
- `apps-script.gs`: a small script that saves each response to a Google Sheet.

Setup takes about an hour and needs no coding.

## Setup, step by step

### 1. Edit the study (see "Editing the tree and tasks" below)

Open `index.html` in a plain text editor (Notepad, TextEdit in plain-text mode, or any code editor). Everything you change is in the CONFIGURATION block at the top. Save, then double-click the file to preview it.

### 2. Create the results sheet (10 min)

1. Create a new Google Sheet and name it, e.g. "Tree test responses".
2. Extensions → Apps Script. Delete what's there, paste the contents of `apps-script.gs`, save.
3. Deploy → New deployment → gear icon → Web app.
   - Description: anything
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when asked (it's your own script writing to your own sheet).
5. Copy the **Web app URL** (it ends in `/exec`).
6. Open `index.html`, find `const ENDPOINT = "";` near the top and paste the URL between the quotes. Save.

If you ever change the script, you must Deploy → Manage deployments → pencil icon → Version: New version → Deploy, otherwise the old one keeps running. Opening the `/exec` URL in a browser should show "Tree test endpoint is running."

### 3. Put it online (15 min)

Any static host works. GitHub Pages is free:

1. Create a new repository, e.g. `my-tree-test`.
2. Upload `index.html` and `logo.svg` together (drag and drop in the GitHub web UI). They must sit in the same folder.
3. Settings → Pages → Source: Deploy from a branch → `main` / root → Save.
4. After a minute the URL appears at the top of that page, like `https://<your-username>.github.io/my-tree-test/`.

You don't need to upload `apps-script.gs` or this README.

### 4. One link per channel (optional)

Same page, different tag. The tag lands in the `src` column so you can split results by audience.

- Slack: `https://<you>.github.io/my-tree-test/?src=slack`
- Newsletter: `…/?src=newsletter`
- Customers: `…/?src=customer`

### 5. Test end to end

Open your link and complete the study once. A row should appear in the sheet within a few seconds. Delete that row before you share the link. The page remembers completion per browser, so to retake it yourself open the link in a private window or add `?reset` to the URL.

## Editing the tree and tasks

Everything lives in the CONFIGURATION block of `index.html`, numbered 1 to 7.

**The tree** (`TREE`) is a list of items. An item with `children` can be opened; an item without is a final destination. Items with `group` are headings that only organise the list and cannot be clicked. Every item automatically gets an id from its labels joined with `>`, for example `config > encryption > rotate key`.

```js
{ group: "Data", children: [
  { label: "backup", children: [
    { label: "create" },
    { label: "verify" }
  ]}
]}
```

**Tasks** (`TASKS`) each have an id, the text participants read, and `correct`: the list of destinations that count as a success, written as those ids. Add `deep: true` to also accept anything inside a listed item.

```js
{ id: "T3", text: "You suspect an old backup might be corrupted. Where would you check that a backup is intact?",
  correct: ["backup > verify"] }
```

Four to eight tasks is a good number. Write them as situations, not as label hunts: "you deleted a file by mistake" works, "find the restore command" gives the answer away. If a task's `correct` path does not exist in the tree, a warning appears in the browser's developer console when the page loads.

**Questions** before (`PRE`) and after (`POST`) the tasks can be single choice, multiple choice, a 1-to-5 scale, or free text. Delete the ones you don't need.

**Pinned items** (`PINNED`) is an optional shortcut section at the top of the tree, for simulating a participant who has already bookmarked a few pages. It is off by default.

**Settings** (`STUDY`) hold the study id, the browser tab title, the logo, the accent colour and whether tasks are shuffled. **Copy** (`COPY`) holds every sentence participants read.

If you change the tree or the tasks after responses have started coming in, change `STUDY.id` too, so old and new responses don't mix.

For a real-world example with a larger tree, six tasks and pinned items switched on, see [`examples/pmm-navigation/`](examples/pmm-navigation/).

## What participants experience

- A welcome screen, your PRE questions, a short explanation, the tasks, your POST questions, a thank-you screen.
- On each task they click through the tree, select an item and confirm with "I'd find it here", or choose "Not sure where I'd go".
- They can go back and change answers to the questions before and after. Tasks are one-way: once answered they cannot be revisited, because the path, back-steps and timing measure the first attempt.
- Tasks are shown in a random order per participant, so tiredness affects every task equally.

## What gets recorded

One row per participant in the `Responses` tab of your sheet:

- when they started and finished, a random participant id, the `src` tag and the browser they used
- one column per question, named after the question id (for example `role`, `ease`, `hardest`)
- for each task, six columns: the **outcome**, the **destination** they chose, the number of **back**-steps, the **seconds** it took, the **order** the task was shown in, and the full click **path**
- the raw submission as a safety copy in the last column

The outcome is one of:

| Outcome | Meaning |
|---|---|
| `direct` | Found a correct destination without ever going back |
| `indirect` | Found a correct destination after backtracking |
| `direct-fail` | Chose a wrong destination without going back |
| `indirect-fail` | Chose a wrong destination after backtracking |
| `skipped` | Clicked "Not sure where I'd go" |

The columns are created from the first response, so they always match your study. If a submission cannot be parsed it lands in an `Errors` tab instead of being lost.

## Reading your results

Aim for around 30 participants or more per audience before drawing conclusions. Then, for each task:

- **Success %** is the share of participants who ended in a correct destination, whether or not they backtracked (`direct` plus `indirect`). It tells you whether the destination can be found at all. A task under about **70%** has a findability problem.
- **Direct success %** is the share who went straight there without a single back-step. It tells you whether the labels are self-evident or whether people have to guess and recover. A task under about **50%** means the labels are not doing their job even if people get there eventually.
- **Failure paths** are the destinations people chose when they were wrong, and the first item they clicked. If most failures cluster on the same wrong item, that item is where people expect the feature to be. That is usually a clearer signal than the success number itself: it tells you what to rename or move.

Also look at the `skipped` count (people who gave up) and the time per task (a slow "direct" success is still a struggle). Compare audiences by the `src` column and by your PRE questions.

Those pass marks are suggestions, not rules. A task that a small group of experts must get right every time deserves a higher bar than a rarely used setting.

## Contributing

Issues and pull requests are welcome. Keep the tool a single dependency-free HTML file, and check that test mode still works by double-clicking `index.html` before you open a pull request.
