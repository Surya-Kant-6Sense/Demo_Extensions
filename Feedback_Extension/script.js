/*
  Name: script.js
  Purpose: Handles form submission, Excel updates, Tableau metadata fetching, modal controls, and screenshot functionality with preview.
  Author: Surya Kant Mani
  Version: 1.0.7
  Created At: September 25, 2024
  Updated At: September 25, 2024
  Update Description: Added screenshot preview feature, fixed cross button hover effect, and improved form controls.
  Production Go-Live Date: N/A
*/

/* When the document is ready */
document.addEventListener('DOMContentLoaded', function() {
  tableau.extensions.initializeAsync().then(() => {
    const dashboard = tableau.extensions.dashboardContent.dashboard;

    /* Pre-fill Workbook and Screen from Tableau */
    document.getElementById('dashboard').value = dashboard.workbook.name;
    document.getElementById('screen').value = dashboard.name;

    /* Fetch User and Owner Information from Tableau */
    const user = tableau.extensions.environment.context.userName;
    const userEmail = tableau.extensions.environment.context.userEmail;
    const owner = dashboard.workbook.authorName; // Author of the workbook
    const ownerEmail = dashboard.workbook.authorEmail; // Owner's email

    /* Populate the view dropdown with the names of all sheets in the dashboard */
    const viewDropdown = document.getElementById('view');
    dashboard.worksheets.forEach(sheet => {
      const option = document.createElement('option');
      option.textContent = sheet.name;
      viewDropdown.appendChild(option);
    });

    /* Handle form submission */
    document.getElementById('feedback-form').addEventListener('submit', function(event) {
      event.preventDefault();
      
      /* Capture feedback data */
      const dashboard = document.getElementById('dashboard').value;
      const screen = document.getElementById('screen').value;
      const view = document.getElementById('view').value;
      const feedbackType = document.getElementById('feedback-type').value;
      const feedbackText = document.getElementById('feedback-text').value;
      const urgentFlag = document.getElementById('mark-urgent').checked;

      /* Generate Feedback ID and Submission Time */
      const feedbackId = generateFeedbackId(); // Function to generate Feedback ID based on the last feedback
      const submissionTime = new Date().toISOString(); // Current time in ISO format

      /* Submit feedback to Excel */
      submitFeedbackToExcel({
        feedbackId,
        dashboard,
        screen,
        view,
        feedbackType,
        feedbackText,
        user,
        userEmail,
        owner,
        ownerEmail,
        submissionTime,
        urgentFlag
      });

      /* Show Thank You message after submission */
      document.getElementById('thank-you-message').classList.remove('d-none');
      document.getElementById('feedback-form').classList.add('d-none');
    });

    /* Handle close modal on cross icon */
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
      button.addEventListener('click', function() {
        document.getElementById('thank-you-message').classList.add('d-none');
        document.getElementById('feedback-form').classList.remove('d-none');
        document.querySelector('.modal').classList.remove('show');
        document.querySelector('.modal-backdrop').remove();
      });
    });

    /* Handle screenshot taking */
    document.getElementById('take-screenshot').addEventListener('click', function() {
      takeScreenshot();
    });
  });
});

/* Function to take a screenshot within the dashboard */
function takeScreenshot() {
  tableau.extensions.dashboardContent.dashboard.captureAsync().then(function(dataUri) {
    const screenshotPreview = document.getElementById('screenshot-preview');
    const imgElement = document.getElementById('screenshot-preview-img');
    imgElement.src = dataUri;
    screenshotPreview.classList.remove('d-none'); // Show screenshot preview
    alert('Screenshot captured successfully!');
  }).catch(function(error) {
    console.error("Error taking screenshot: ", error);
  });
}

/* Function to generate the next Feedback ID */
function generateFeedbackId() {
  // Placeholder function to generate a Feedback ID by fetching the last ID from Excel
  const lastFeedbackId = 'FB-010'; // Example of the last feedback ID (this should be fetched from the Excel sheet)
  const nextId = parseInt(lastFeedbackId.split('-')[1]) + 1;
  return `FB-${nextId.toString().padStart(3, '0')}`;
}

/* Function to submit feedback to the Feedbacks sheet in the published Excel */
function submitFeedbackToExcel(feedbackData) {
  const { feedbackId, dashboard, screen, view, feedbackType, feedbackText, user, userEmail, owner, ownerEmail, submissionTime, urgentFlag } = feedbackData;

  /* Logic to integrate with Tableau Extensions API and submit to the Excel data source */
  console.log('Feedback submitted to Excel:', feedbackData);
  // You would use Tableau's data source API to insert this data into the Excel sheet
}
