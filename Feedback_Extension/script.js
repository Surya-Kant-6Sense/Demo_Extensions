/*
  Name: script.js
  Purpose: Handles form submission, Slack notifications, and modal close actions for the Feedback Extension.
  Author: Surya Kant Mani
  Version: 1.0.1
  Created At: September 27, 2024
  Updated At: September 27, 2024
  Updated By: N/A
  Update Description: Added logic to close the modal on Cancel and Close buttons.
  Production Go-Live Date: N/A
*/

/* When the document is ready */
document.addEventListener('DOMContentLoaded', function() {
  /* Initialize Tableau Extension */
  tableau.extensions.initializeAsync().then(() => {
    const dashboard = tableau.extensions.dashboardContent.dashboard;

    /* Pre-fill dashboard and screen fields */
    document.getElementById('dashboard').value = dashboard.workbook.name;
    document.getElementById('screen').value = dashboard.name;

    /* Populate the view dropdown with the names of all sheets in the dashboard */
    const viewDropdown = document.getElementById('view');
    dashboard.worksheets.forEach(sheet => {
      const option = document.createElement('option');
      option.textContent = sheet.name;
      viewDropdown.appendChild(option);
    });

    /* Handle 'Not related to any view' checkbox */
    document.getElementById('no-view').addEventListener('change', function() {
      viewDropdown.disabled = this.checked;
      if (this.checked) {
        viewDropdown.value = 'All';
      }
    });
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

    /* Split feedback by semicolon (;) and generate sequential IDs */
    const feedbackArray = feedbackText.split(';');
    const lastId = getLastFeedbackId();  // Function to retrieve last ID from Excel
    feedbackArray.forEach((feedback, index) => {
      const feedbackId = generateNextId(lastId, index);  // Function to generate sequential ID
      submitFeedbackToExcel(dashboard, screen, view, feedbackType, feedback.trim(), feedbackId);
    });

    /* Show Thank You message after submission */
    document.getElementById('thank-you-message').classList.remove('d-none');
    document.getElementById('feedback-form').classList.add('d-none');
  });

  /* Handle close modal on buttons */
  const closeModalButtons = document.querySelectorAll('.close-modal');
  closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
      document.getElementById('thank-you-message').classList.add('d-none');
      document.getElementById('feedback-form').classList.remove('d-none');
      document.querySelector('.modal').classList.remove('show');
      document.querySelector('.modal-backdrop').remove();
    });
  });
});

/* Function to get the last feedback ID from Excel (placeholder logic) */
function getLastFeedbackId() {
  return 'FB-010';  // Placeholder for the last ID; should be retrieved from the Excel file
}

/* Function to generate the next sequential feedback ID */
function generateNextId(lastId, index) {
  const idNumber = parseInt(lastId.split('-')[1]) + index + 1;
  return `FB-${idNumber.toString().padStart(3, '0')}`;
}

/* Function to submit feedback to the published Excel on Tableau Cloud */
function submitFeedbackToExcel(dashboard, screen, view, feedbackType, feedbackText, feedbackId) {
  /* Logic to integrate with Tableau Extensions API and submit to the Excel data source */
  console.log('Feedback submitted to Excel:', { feedbackId, dashboard, screen, view, feedbackType, feedbackText });
}
