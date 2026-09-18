# Changelog

## Unreleased

- Demo tree is now flat: a command-line tool lists commands without sections, so the section headings gave participants a hint they would not get in real life. Headings remain available for products that show them, such as the PMM example.
- README: explains when to use section headings, describes the four question types with an example, and adds screenshots in `docs/screenshots/`.

## 0.1 — 2026-09-18

First public version, extracted from an internal navigation study.

- Single-file tree test (`index.html`) with a CONFIGURATION block for tree, tasks, pre/post questions, copy, logo and accent colour.
- Example study: the command structure of a made-up command-line backup tool, four tasks.
- Optional pinned/recent shortcut section, off by default.
- Test mode when no endpoint is set: nothing is saved, results shown on screen.
- Google Apps Script receiver that derives sheet columns from each submission, so any number of tasks and questions works.
- Reference example of the original study in `examples/pmm-navigation/`.
- README for first-time users, MIT license.
