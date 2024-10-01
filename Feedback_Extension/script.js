/*
  Name: script.js
  Purpose: Handles form submission, Excel updates, Tableau metadata fetching, modal controls, screenshot functionality, and sound effects.
  Author: Surya Kant Mani
  Version: 1.0.9
  Created At: September 25, 2024
  Updated At: September 25, 2024
  Update Description: Fixed close button, image/screenshot handling, added sound effects, dynamic form width, and integrated with Tableau data source.
  Production Go-Live Date: N/A
*/

/* 
  Tableau Extensions API initializes when the document is loaded. 
  We fetch the dashboard metadata, the user and workbook owner information, 
  and prepare the feedback form with the appropriate view and data source.
*/
new Vue({
  el: '#app',
  data: {
    form: {
      dashboard: '',
      screen: '',
      view: 'Entire Screen',
      feedbackType: 'General Feedback',
      feedback: ''
    },
    sheets: [],  // Array to hold sheet names
    slackWebhookUrl: 'https://hooks.slack.com/services/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', // Replace with your Slack webhook URL
  },
  mounted() {
    this.initializeTableau();
    this.resizeToFitTableau();
    window.addEventListener('resize', this.resizeToFitTableau); // Adjust size on window resize
  },
  methods: {
    initializeTableau() {
      tableau.extensions.initializeAsync().then(() => {
        const dashboard = tableau.extensions.dashboardContent.dashboard;

        // Populate dashboard and screen details
        this.form.dashboard = dashboard.workbook.name;
        this.form.screen = dashboard.name;

        // Fetch sheets (views) from the current dashboard
        this.sheets = dashboard.worksheets.map(sheet => sheet.name);
      });
    },
    resizeToFitTableau() {
      const tableauObject = tableau.extensions.dashboardContent.dashboard.size;
      const formContainer = document.querySelector('.form-container');

      formContainer.style.height = tableauObject.height + 'px';
      formContainer.style.width = tableauObject.width + 'px';
    },
    captureSnapshot() {
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      const selectedSheet = this.form.view;

      let sheetToCapture;

      if (selectedSheet === 'Entire Screen') {
        // Capture the entire dashboard
        sheetToCapture = dashboard;
      } else {
        // Capture the specific sheet (view) selected by the user
        sheetToCapture = dashboard.worksheets.find(sheet => sheet.name === selectedSheet);
      }

      // Capture the image using the Tableau API
      return sheetToCapture.exportImageAsync().then(image => {
        return image; // Image URL is returned
      });
    },
    submitForm() {
      this.captureSnapshot().then(snapshotImage => {
        const message = {
          text: `New feedback submitted:\n*Dashboard*: ${this.form.dashboard}\n*Screen*: ${this.form.screen}\n*View*: ${this.form.view}\n*Feedback Type*: ${this.form.feedbackType}\n*Feedback*: ${this.form.feedback}`,
          attachments: [
            {
              fallback: "Snapshot of the dashboard.",
              image_url: snapshotImage,  // Add snapshot image to Slack message
              title: "Dashboard Snapshot"
            }
          ]
        };

        // Send feedback to Slack using Webhook
        fetch(this.slackWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        })
        .then(response => {
          if (response.ok) {
            alert('Feedback submitted successfully with a snapshot!');
          } else {
            alert('Failed to submit feedback');
          }
        })
        .catch(error => {
          console.error('Error sending feedback to Slack:', error);
          alert('An error occurred. Please try again.');
        });
      }).catch(error => {
        console.error('Error capturing snapshot:', error);
      });
    }
  }
});
