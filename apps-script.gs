/**
 * PMM tree test — Google Apps Script receiver.
 *
 * Paste this into Extensions → Apps Script of the Google Sheet that should
 * collect responses, then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Paste the resulting /exec URL
 * into ENDPOINT in index.html.
 *
 * Each completed study becomes one row. Tasks are stored in a fixed column
 * order (T1, T2, …) regardless of the order the participant saw them; the
 * order they saw is recorded in the "<task>_order" column.
 */

var SHEET_NAME = "Responses";   // tab that receives rows (created if missing)
var TASK_IDS   = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"]; // keep in sync with TASKS in index.html
var TASK_COLS  = ["outcome", "destination", "backs", "seconds", "order", "path"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    ensureHeader_(sheet);
    sheet.appendRow(toRow_(data));
    return json_({ ok: true });
  } catch (err) {
    var errSheet = getSheet_("Errors");
    errSheet.appendRow([new Date(), String(err), e && e.postData ? e.postData.contents : ""]);
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the /exec URL in a browser shows this. Handy to check the deployment works.
function doGet() {
  return ContentService.createTextOutput("PMM tree test endpoint is running.");
}

// ---------- helpers ----------

function header_() {
  var h = ["timestamp", "study", "participant", "src", "startedAt", "finishedAt", "ua",
           "role", "role_other", "versions",
           "ease", "hub_expect", "hub_expect_other", "hardest"];
  TASK_IDS.forEach(function (id) {
    TASK_COLS.forEach(function (c) { h.push(id + "_" + c); });
  });
  h.push("raw_json");
  return h;
}

function toRow_(d) {
  var pre = d.pre || {}, post = d.post || {};
  var row = [
    new Date(), d.study || "", d.participant || "", d.src || "", d.startedAt || "", d.finishedAt || "", d.ua || "",
    str_(pre.role), str_(pre.role_other), str_(pre.versions),
    str_(post.ease), str_(post.hub_expect), str_(post.hub_expect_other), str_(post.hardest)
  ];
  var byId = {};
  (d.tasks || []).forEach(function (t) { byId[t.id] = t; });
  TASK_IDS.forEach(function (id) {
    var t = byId[id];
    if (!t) { TASK_COLS.forEach(function () { row.push(""); }); return; }
    row.push(t.outcome || "", t.destination || "", t.backs || 0,
             Math.round((t.ms || 0) / 100) / 10, t.order || "", (t.path || []).join(" | "));
  });
  row.push(JSON.stringify(d));
  return row;
}

function str_(v) {
  if (v === undefined || v === null) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var n = name || SHEET_NAME;
  return ss.getSheetByName(n) || ss.insertSheet(n);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header_());
    sheet.setFrozenRows(1);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
