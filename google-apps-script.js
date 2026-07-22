// Paste this into Google Apps Script (Extensions → Apps Script)
// Then: Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
//
// IMPORTANT: Replace YOUR_SPREADSHEET_ID below with the ID from your Google Sheet URL:
// https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit

const SPREADSHEET_ID = '1ije8gkbyh2Hkcmi2wQaUa0iMHlXsgfdSbeqtTARvI4g';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

    // Add header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp (IST)', 'Full Name', 'Mobile Number', 'Email Address',
        'City & State', 'Bag Type', 'Size of Bags', 'Quantity',
        'Custom Printing', 'Additional Notes'
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#C8673A').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const d = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
      d.name        || '',
      d.phone       || '',
      d.email       || '',
      d.city        || '',
      d.bagType     || '',
      d.bagSize     || '',
      d.qty         || '',
      d.printing    || '',
      d.specs       || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Alorex Enquiry Sheet is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}
