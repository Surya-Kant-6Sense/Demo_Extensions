/*
  Name: script.js
  Purpose: Handles form submission, Excel updates, Tableau metadata fetching, modal controls, screenshot functionality, and sound effects.
  Author: Surya Kant Mani
  Version: 1.0.8
  Created At: September 25, 2024
  Updated At: September 25, 2024
  Update Description: Fixed modal closure, added shine and enlargement effects, added sound effects for form actions, and updated Excel submission logic.
  Production Go-Live Date: N/A
*/

/* 
  Tableau Extensions API initializes when the document is loaded. 
  We fetch the dashboard metadata, the user and workbook owner information, 
  and prepare the feedback form with the appropriate view and data source.
*/
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

    /* Fetch the list of data sources (Excel) in the current dashboard */
    fetchDataSources().then((dataSource) => {
      /* We now have access to the Excel data source */
      console.log('Connected to Excel data source:', dataSource.name);
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

      /* Submit feedback to Excel (Data Source) */
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

      /* Play submit sound */
      document.getElementById('submit-sound').play();

      /* Show Thank You message after submission */
      document.getElementById('thank-you-message').classList.remove('d-none');
      document.getElementById('feedback-form').classList.add('d-none');
    });

    /* Handle close modal on 'Close' button */
    document.getElementById('close-btn').addEventListener('click', function() {
      document.getElementById('feedbackModal').classList.remove('show');
      document.querySelector('.modal-backdrop').remove();
      document.getElementById('close-sound').play(); // Play close sound
    });

    /* Handle screenshot taking */
    document.getElementById('take-screenshot').addEventListener('click', function() {
      takeScreenshot();
    });

    /* Play sound when modal is opened */
    document.getElementById('feedbackModal').addEventListener('shown.bs.modal', function() {
      document.getElementById('open-sound').play();
    });
  });
});

/* 
  Function to fetch data sources (Excel file) from the Tableau dashboard.
  This function retrieves all data sources in the current dashboard and returns the Excel data source.
*/
async function fetchDataSources() {
  const dataSources = await tableau.extensions.dashboardContent.dashboard.getDataSourcesAsync();
  const excelDataSource = dataSources.find(ds => ds.name === 'Feedback_Tracker'); // Ensure this matches the name of your published Excel data source

  if (!excelDataSource) {
    throw new Error('Excel data source not found!');
  }

  return excelDataSource;
}

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

/* 
  Function to generate the next Feedback ID.
  The Feedback ID is generated by fetching the last ID from the Excel data source (this should be adjusted based on real data).
*/
function generateFeedbackId() {
  // Placeholder function to generate a Feedback ID by fetching the last ID from Excel
  const lastFeedbackId = 'FB-010'; // Example of the last feedback ID (this should be fetched from the Excel sheet)
  const nextId = parseInt(lastFeedbackId.split('-')[1]) + 1;
  return `FB-${nextId.toString().padStart(3, '0')}`;
}

/* 
  Function to submit feedback data to the Excel sheet.
  This function writes the captured feedback to the Excel file using Tableau's data source API.
*/
async function submitFeedbackToExcel(feedbackData) {
  const {
    feedbackId, dashboard, screen, view, feedbackType, feedbackText,
    user, userEmail, owner, ownerEmail, submissionTime, urgentFlag
  } = feedbackData;

  const dataSource = await fetchDataSources(); // Fetch the Excel data source

  // Create a new record to be inserted into the Excel sheet
  const newRecord = [
    { fieldName: 'Feedback ID', value: feedbackId },
    { fieldName: 'Workbook', value: dashboard },
    { fieldName: 'Screen', value: screen },
    { fieldName: 'View', value: view },
    { fieldName: 'Feedback Type', value: feedbackType },
    { fieldName: 'Feedback', value: feedbackText },
    { fieldName: 'User Name', value: user },
    { fieldName: 'User Email', value: userEmail },
    { fieldName: 'Owner Name', value: owner },
    { fieldName: 'Owner Email', value: ownerEmail },
    { fieldName: 'Submission Time', value: submissionTime },
    { fieldName: 'Urgent Flag', value: urgentFlag ? 'Yes' : 'No' }
  ];

  console.log('New feedback record to be inserted into Excel:', newRecord);

  // Insert the new record into the Excel data source (actual implementation required here)
}
