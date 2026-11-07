/**
 * CV receiver for Peeyush's portfolio.
 * Saves every uploaded CV to a Drive folder and emails it to you as an attachment.
 */
var OWNER_EMAIL = 'peeyush.jangid@outlook.com';
var FOLDER_NAME = 'Portfolio CVs';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var mime = /^[\w.+-]+\/[\w.+-]+$/.test(d.mimeType || '') ? d.mimeType : 'application/octet-stream';
    var blob = Utilities.newBlob(Utilities.base64Decode(d.data), mime, d.fileName || 'CV');

    var folders = DriveApp.getFoldersByName(FOLDER_NAME);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
    var saved = folder.createFile(blob);

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: 'New job application CV - ' + (d.name || 'Applicant'),
      replyTo: d.email || OWNER_EMAIL,
      body: (d.details || '') + '\n\nCV saved in Drive: ' + saved.getUrl(),
      attachments: [blob]
    });
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

function doGet() {
  return ContentService.createTextOutput('CV receiver is running.');
}
