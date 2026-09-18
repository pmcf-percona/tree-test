/**
 * Tree test — Google Apps Script receiver.
 *
 * Paste this into Extensions → Apps Script of the Google Sheet that should
 * collect responses, then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Paste the resulting /exec URL
 * into ENDPOINT in index.html.
 *
 * Works with any configuration: columns are derived from what index.html
 * sends. Each completed study becomes one row in the "Responses" tab:
 *
 *   timestamp, study, participant, src, startedAt, finishedAt, ua,
 *   one column per pre/post question (named by the question id, e.g. "role",
 *   "role_other", "ease"), then for each task, in id order:
 *   <id>_outcome, <id>_destination, <id>_backs, <id>_seconds, <id>_order, <id>_path
 *   and finally raw_json (the full submission, as a safety copy).
 *
 * If a later submission has a question or task the header doesn't know yet
 * (for example after you edit the study), the missing columns are added
 * automatically, just before raw_json. Existing columns are never moved.
 *
 * Tasks are stored in id order regardless of the order the participant saw
 * them; the order they saw is in "<id>_order".
 */

var SHEET_NAME = "Responses";   // tab that receives rows (created if missing)
var TASK_COLS  = ["outcome", "destination", "backs", "seconds", "order", "path"];
var FIXED_COLS = ["timestamp", "study", "participant", "src", "startedAt", "finishedAt", "ua"];
var RAW_COL    = "raw_json";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var values = toValues_(data);
    var header = ensureHeader_(sheet, Object.keys(values));
    var row = header.map(function (col) { return values.hasOwnProperty(col) ? values[col] : ""; });
    sheet.appendRow(row);
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
  return ContentService.createTextOutput("Tree test endpoint is running.");
}

// ---------- helpers ----------

// Flatten one submission into { columnName: value }, in the order columns should appear.
function toValues_(d) {
  var v = {};
  v.timestamp = new Date();
  v.study = d.study || "";
  v.participant = d.participant || "";
  v.src = d.src || "";
  v.startedAt = d.startedAt || "";
  v.finishedAt = d.finishedAt || "";
  v.ua = d.ua || "";

  addAnswers_(v, d.pre);
  addAnswers_(v, d.post);

  var tasks = (d.tasks || []).slice().sort(function (a, b) { return naturalCompare_(a.id, b.id); });
  tasks.forEach(function (t) {
    var id = String(t.id);
    v[id + "_outcome"] = t.outcome || "";
    v[id + "_destination"] = t.destination || "";
    v[id + "_backs"] = t.backs || 0;
    v[id + "_seconds"] = Math.round((t.ms || 0) / 100) / 10;
    v[id + "_order"] = t.order || "";
    v[id + "_path"] = (t.path || []).join(" | ");
  });

  v[RAW_COL] = JSON.stringify(d);
  return v;
}

function addAnswers_(v, answers) {
  if (!answers) return;
  Object.keys(answers).forEach(function (k) {
    var key = k;
    if (v.hasOwnProperty(key)) key = k + "_2"; // a pre and post question share an id
    v[key] = str_(answers[k]);
  });
}

function str_(v) {
  if (v === undefined || v === null) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

// "T2" < "T10", unlike plain string comparison
function naturalCompare_(a, b) {
  var re = /(\d+)|(\D+)/g;
  var xa = String(a).match(re) || [], xb = String(b).match(re) || [];
  for (var i = 0; i < Math.min(xa.length, xb.length); i++) {
    var na = parseInt(xa[i], 10), nb = parseInt(xb[i], 10);
    if (!isNaN(na) && !isNaN(nb)) { if (na !== nb) return na - nb; }
    else if (xa[i] !== xb[i]) return xa[i] < xb[i] ? -1 : 1;
  }
  return xa.length - xb.length;
}

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var n = name || SHEET_NAME;
  return ss.getSheetByName(n) || ss.insertSheet(n);
}

// Make sure row 1 contains every column this submission needs. Returns the header.
function ensureHeader_(sheet, wanted) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(wanted);
    sheet.setFrozenRows(1);
    return wanted;
  }
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  var missing = wanted.filter(function (c) { return header.indexOf(c) === -1; });
  if (missing.length === 0) return header;

  var rawIdx = header.indexOf(RAW_COL); // insert new columns before raw_json so it stays last
  var at = rawIdx === -1 ? header.length : rawIdx;
  if (at < header.length) sheet.insertColumnsBefore(at + 1, missing.length);
  sheet.getRange(1, at + 1, 1, missing.length).setValues([missing]);
  header.splice.apply(header, [at, 0].concat(missing));
  return header;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
