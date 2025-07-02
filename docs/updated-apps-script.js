// Google Apps Script for handling contact form submissions
const sheetName = 'Contact Form Submissions';
const scriptProp = PropertiesService.getScriptProperties();

// Initial setup - run this function manually once before deploying
function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
  console.log('Script initialized with spreadsheet ID: ' + activeSpreadsheet.getId());
  
  // Ensure the sheet exists and has correct headers
  let sheet = activeSpreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = activeSpreadsheet.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Name', 'Email', 'Message']]);
    sheet.setFrozenRows(1);
    console.log('Created new sheet with headers');
  }
  
  return 'Setup completed successfully!';
}

// Handle POST requests from the form
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    Logger.log('Received form submission: ' + JSON.stringify(e));
    
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);
    
    if (!sheet) {
      Logger.log('Sheet not found, creating it now');
      const newSheet = doc.insertSheet(sheetName);
      newSheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Name', 'Email', 'Message']]);
      newSheet.setFrozenRows(1);
    }
    
    // Extract the form data, handling both JSON and form-encoded formats
    let formData = {};
    
    if (e.postData && e.postData.contents) {
      Logger.log('Processing POST data: ' + e.postData.contents);
      try {
        // Try to parse as JSON first
        formData = JSON.parse(e.postData.contents);
        Logger.log('Parsed as JSON: ' + JSON.stringify(formData));
      } catch (error) {
        // If not JSON, it might be form-encoded
        Logger.log('Not JSON, trying form parameters');
        formData = e.parameter;
      }
    } else if (e.parameter) {
      // Direct form parameters
      Logger.log('Using direct parameters');
      formData = e.parameter;
    }
    
    Logger.log('Extracted form data: ' + JSON.stringify(formData));
    
    // Prepare the data row
    const timestamp = new Date();
    const row = [
      timestamp,
      formData.name || '',
      formData.email || '',
      formData.message || ''
    ];
    
    // Append to sheet
    sheet.appendRow(row);
    Logger.log('Data added to row: ' + sheet.getLastRow());
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'timestamp': timestamp.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch (error) {
    // Log any errors
    Logger.log('Error in processing form: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.toString(),
        'stack': error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  finally {
    // Always release the lock
    lock.releaseLock();
  }
}

// Test function to verify the script is working
function test() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message',
    date: new Date().toISOString()
  };
  
  // Mock a POST event
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  // Process the mock submission
  const result = doPost(mockEvent);
  Logger.log('Test result: ' + result.getContent());
  return 'Test completed';
}

// Handle GET requests - not used but good for debugging
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'active', 'message': 'The form submission API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
