/**
 * CNF dealership leads -> Google Sheet
 *
 * Setup (5 minutes):
 * 1. Create a Google Sheet (e.g. "CNF Dealer Leads").
 * 2. Extensions > Apps Script. Delete what is there, paste this whole file, Save.
 * 3. Deploy > New deployment > Select type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, allow access, copy the Web app URL.
 * 4. In index.html (top of the <script>), paste it:  leadUrl: "https://script.google.com/macros/s/XXXX/exec",
 *
 * How it works:
 * - Step 1 of the form (name, mobile, pin) creates a row with stage = step1.
 * - Step 2 (business details, email) updates the SAME row (matched by Ref) to stage = complete.
 * - So a visitor who stops after step 1, or never presses Send in WhatsApp, is still in the sheet.
 * - Your CRM or email tool can read new rows from this sheet (Zapier, Make, Pabbly, or CSV export).
 */
var HEADERS = ['Time', 'Ref', 'Stage', 'Name', 'Mobile', 'Email', 'Pin code', 'Shop',
  'Wants to be', 'Fertiliser business', 'Brands sold', 'Monthly purchase', 'Interested in',
  'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'Page'];
var KEYS = ['time', 'ref', 'stage', 'name', 'phone', 'email', 'pin', 'shop',
  'role', 'business', 'brands', 'volume', 'interest',
  'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'page'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    var p = (e && e.parameter) || {};
    var row = KEYS.map(function (k) { return k === 'time' ? new Date() : String(p[k] || '').slice(0, 500); });

    var found = -1;
    var last = sheet.getLastRow();
    if (p.ref && last > 1) {
      var refs = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var i = refs.length - 1; i >= 0; i--) {
        if (refs[i][0] === p.ref) { found = i + 2; break; }
      }
    }
    if (found > -1) {
      var stageNow = sheet.getRange(found, 3).getValue();
      // never let a late "step1" overwrite a "complete" row
      if (!(stageNow === 'complete' && p.stage === 'step1')) {
        sheet.getRange(found, 1, 1, KEYS.length).setValues([row]);
      }
    } else {
      sheet.appendRow(row);
    }
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
