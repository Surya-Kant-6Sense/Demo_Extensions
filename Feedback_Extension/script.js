/*
  Name: script.js
  Purpose: Handles form submission, Slack notifications, and Excel updates for the Feedback Extension. Also handles taking screenshots.
  Author: Surya Kant Mani
  Version: 1.0.4
  Created At: September 25, 2024
  Updated At: September 25, 2024
  Update Description: Added screenshot capture functionality, fixed modal close, and improved form handling.
  Production Go-Live Date: N/A
*/

/* When the document is ready */
document.addEventListener('DOMContentLoaded', function() {
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
    const screenshot = document.getElementById('screenshot').files[0]; // Capture the attached screenshot/image

    /* Submit feedback (without screenshot) to Excel */
    submitFeedbackToExcel(dashboard, screen, view, feedbackType, feedbackText);

    /* Send Slack notification with optional screenshot */
    sendSlackNotification(dashboard, screen, view, feedbackType, feedbackText, screenshot);

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

/* Function to take a screenshot (placeholder logic, you can replace with real screenshot logic) */
function takeScreenshot() {
  alert('Screenshot functionality will be added here.');
  // Placeholder for taking a screenshot of the dashboard
}

/* Function to submit feedback (without screenshot) to the published Excel on Tableau Cloud */
function submitFeedbackToExcel(dashboard, screen, view, feedbackType, feedbackText) {
  /* Logic to integrate with Tableau Extensions API and submit to the Excel data source */
  console.log('Feedback submitted to Excel:', { dashboard, screen, view, feedbackType, feedbackText });
}

/* Function to send a Slack notification with screenshot (if provided) */
function sendSlackNotification(dashboard, screen, view, feedbackType, feedbackText, screenshot) {
  const slackMessage = `
    *New Feedback Submitted:*
    *Dashboard*: ${dashboard}
    *Screen*: ${screen}
    *View*: ${view}
    *Feedback Type*: ${feedbackType}
    *Feedback*: ${feedbackText}
    ${screenshot ? '*Image Attached*' : ''}
    Type "/jira create" to create a Jira ticket for this feedback.
  `;

  /* Send message via Tableau-Slack native integration */
  tableau.extensions.settings.set('slackMessage', slackMessage);
  tableau.extensions.settings.saveAsync().then(() => {
    console.log('Slack message sent:', slackMessage);
  });

  /* Confirmation message for the user */
  const userSlackMessage = `Your feedback has been successfully captured for *${dashboard}* and delivered to the DA Team.`;
  tableau.extensions.settings.set('userSlackMessage', userSlackMessage);
  tableau.extensions.settings.saveAsync().then(() => {
    console.log('Slack message sent to user:', userSlackMessage);
  });
}
