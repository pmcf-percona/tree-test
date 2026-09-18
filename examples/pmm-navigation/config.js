/* =========================================================================
   Example study: PMM (Percona Monitoring and Management) main menu
   =========================================================================
   This is the configuration of the study this template was first built for.
   It tests the left-hand sidebar of a database monitoring web app.

   To use it, open index.html and replace the matching blocks (STUDY, TREE,
   PINNED, TASKS, PRE, POST, COPY) in the CONFIGURATION section with the
   ones below. ENDPOINT is not included; set your own.

   Things worth copying from this study:
   - "Home page" and the technology "hub pages" are accepted answers for
     several tasks because the concept being tested was a summary page that
     links onwards, not a single dashboard.
   - PINNED simulates a participant who has already pinned three pages. Two
     of them are accepted answers (tasks 1 and 2); "MySQL InnoDB details" is
     a distractor no task accepts. Expect tasks 1 and 2 to score higher than
     the rest for that reason.
   - Search is deliberately not a node. Tree tests measure browsing.
   - The commented-out T7 is a "muscle memory" probe using `deep: true`.
   ========================================================================= */

const STUDY = {
  id: "pmm-wayfinding-v1",
  title: "PMM navigation study",
  logo: "logo.svg",              // put the product logo next to index.html, or "" for none
  logoAlt: "Percona Monitoring and Management",
  accent: "#653DF4",
  randomizeTasks: true,
  passMarks: { success: 0.70, direct: 0.50 }
};

const TREE = [
  { label: "Home page" },
  { group: "Technologies", children: [
    { label: "MongoDB hub page" },
    { label: "MySQL hub page" },
    { label: "PostgreSQL hub page" },
    { label: "Valkey hub page" },
    { label: "Operating system" }
  ]},
  { group: "Analysis & alerting", children: [
    { label: "Advisors" },
    { label: "Alerts", children: [
      { label: "Status" }, { label: "Alert rules" }, { label: "Templates" }, { label: "Contact points" },
      { label: "Notification policies" }, { label: "Silences" }, { label: "Alert groups" }, { label: "Alert settings" } ]},
    { label: "Explore data" },
    { label: "Query analytics" }
  ]},
  { group: "Browse", children: [
    { label: "All dashboards" },
    { label: "Apps", children: [
      { label: "Data archiving" }, { label: "MongoDB backups" }, { label: "MySQL backups" }, { label: "PostgreSQL backups" },
      { label: "ProxySQL manager" }, { label: "Replication checksums" }, { label: "Schema changes" }, { label: "Support diagnostics" },
      { label: "Valkey backups" }, { label: "Get more apps" } ]},
    { label: "Inventory", children: [ { label: "Services" }, { label: "Nodes" } ]}
  ]},
  { group: "Administration", children: [
    { label: "PMM HA" },
    { label: "Configuration", children: [
      { label: "Settings" }, { label: "Updates" },
      { label: "Org. management", children: [ { label: "Organizations" }, { label: "Stats and licenses" }, { label: "Default preferences" } ] } ]},
    { label: "Users and access", children: [
      { label: "Users" }, { label: "Teams" }, { label: "Services accounts" }, { label: "Access roles" } ]},
    { label: "Account", children: [
      { label: "Profile" }, { label: "Notification history" }, { label: "Change password" } ]},
    { label: "Help" }
  ]}
];

// Simulated pinned pages, shown as the first section of the menu.
const PINNED = {
  enabled: true,
  label: "My navigation",
  items: ["MongoDB backups", "MySQL InnoDB details", "PostgreSQL query analytics"]
};

const TASKS = [
  { id: "T1", text: "One of your MongoDB clusters is copied to safe storage every night. Check whether last night's copy finished without errors.",
    correct: ["My navigation > MongoDB backups", "MongoDB hub page", "Apps > MongoDB backups", "Home page"] },
  { id: "T2", text: "Users say a PostgreSQL database got slow this morning. Find where you'd see which SQL statements are taking the longest to run.",
    correct: ["My navigation > PostgreSQL query analytics", "PostgreSQL hub page", "Query analytics"] },
  { id: "T3", text: "You've just set up a new MySQL server. Where would you go so PMM starts monitoring it?",
    correct: ["MySQL hub page", "Inventory > Services"] },
  { id: "T4", text: "You've just been paged/notified. Find the quickest place to see which of your databases currently have a problem.",
    correct: ["Home page", "Alerts > Status"] },
  { id: "T5", text: "You want to be told when replication lag on a MongoDB cluster goes above a threshold. Where would you set that up?",
    correct: ["Alerts > Alert rules", "Alerts > Templates", "MongoDB hub page"] },
  { id: "T6", text: "Percona Support asked you to send a diagnostics bundle from your PMM server. Where would you get it?",
    correct: ["Apps > Support diagnostics"] }
  // Optional muscle-memory probe — uncomment to include:
  // ,{ id: "T7", text: "Find the list of configuration and security recommendations PMM has generated for your databases.",
  //   correct: ["Advisors"], deep: true }
];

const PRE = [
  { id: "role", type: "single", q: "Which best describes your role?",
    options: ["DBA / database engineer", "SRE / DevOps / platform engineer", "Software developer"], other: true },
  { id: "versions", type: "multi", q: "Which PMM versions have you used?",
    options: ["PMM 2", "PMM 3"], optOut: "I haven't used PMM" }
];

const POST = [
  { id: "ease", type: "scale", q: "Overall, how easy was it to find things in this menu?", low: "Very hard", high: "Very easy" },
  { id: "hub_expect", type: "single", q: "If you clicked \"MySQL hub page\" in a database monitoring tool, what would you expect to see?",
    options: ["A list of dashboards to choose from", "A summary page: health, your clusters, and links to apps, tools and actions", "The main MySQL dashboard straight away"], other: true },
  { id: "hardest", type: "text", q: "Which task was hardest, and what did you expect to click instead?", optional: true }
];

const COPY = {
  welcomeTitle: "Help us make PMM easier to navigate",
  welcome: "This takes about 5 minutes. You'll see a text-only version of PMM's (Percona Monitoring and Management) main menu, the sidebar you use to move around between pages. We'll give you a few tasks and ask you to click through and select a page. There are no wrong answers.",
  welcome2: "Your answers are anonymous unless you choose to get in touch at the end.",
  start: "Start",
  taskIntro: "Each task describes something you need to do. Click through the menu the way you would in the real PMM sidebar. When you see the item you believe opens the page you need, select it and click \"I'd find it here\". Go with your instinct.",
  taskPrompt: "Where in the menu would you click to reach this?",
  rootLabel: "Main menu",
  hereLabel: "I'd find it here",
  skipLabel: "Not sure where I'd go",
  beginLabel: "Begin test",
  continueLabel: "Continue",
  backLabel: "‹ Back",
  thanksTitle: "Thanks. That helps a lot.",
  thanks: "Your answers feed directly into how PMM's navigation will work in the next major release.",
  thanks2: "Open to a 20-minute follow-up call about how you use PMM? Reply where you found this link.",
  already: "You've already taken part in this study from this browser. Thank you!"
};
