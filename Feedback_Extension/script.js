/*
  Name: script.js
  Purpose: Handles form submission, Slack notifications, and Jira integration for the Feedback Extension.
  Author: Surya Kant Mani
  Version: 1.0.0
  Created At: September 26, 2024
  Updated At: N/A
  Updated By: N/A
  Update Description: Initial version.
  Production Go-Live Date: N/A
*/

/* When the document is ready */
document.addEventListener('DOMContentLoaded', function() {
  /* Dynamically populate the dashboard, screen, and view fields */
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

    /* Submit data to the published Excel in Tableau Cloud */
    submitFeedbackToExcel(dashboard, screen, view, feedbackType, feedbackText);

    /* Send Slack notification to the owner */
    sendSlackNotification(dashboard, feedbackType, feedbackText);

    /* Create Jira ticket if necessary */
    if (feedbackType !== 'general') {
      createJiraTicket(dashboard, feedbackType, feedbackText);
    }

    /* Close the modal after submission */
    alert('Feedback successfully submitted!');
    document.querySelector('.btn-close').click();
  });
});

/* Function to submit feedback to the published Excel on Tableau Cloud */
function submitFeedbackToExcel(dashboard, screen, view, feedbackType, feedbackText) {
  /* Logic to integrate with Tableau Extensions API and submit to the Excel data source */
  console.log('Feedback submitted to Excel:', { dashboard, screen, view, feedbackType, feedbackText });
}

/* Function to send a Slack notification to the owner */
function sendSlackNotification(dashboard, feedbackType, feedbackText) {
  /* Slack API integration */
  console.log('Slack notification sent:', { dashboard, feedbackType, feedbackText });
}

/* Function to create a Jira ticket */
function createJiraTicket(dashboard, feedbackType, feedbackText) {
  /* Jira API integration */
  console.log('Jira ticket created:', { dashboard, feedbackType, feedbackText });
}
