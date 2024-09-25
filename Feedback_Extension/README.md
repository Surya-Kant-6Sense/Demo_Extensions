# Feedback Extension

The **Feedback Extension** enhances your Tableau dashboards by allowing users to submit feedback directly from the dashboard interface. The extension integrates with **Slack** for notifications and comments, and **Jira** for creating tasks based on feedback. Users can also attach screenshots or images and track the status of their feedback in real-time.

---

## Features

- **Feedback Form**: Submit feedback directly from a Tableau dashboard, with options for general feedback, feature requests, enhancements, data anomalies, or questions.
- **Slack Integration**: Notifications are sent to dashboard owners. Owners can respond directly in Slack.
- **Jira Integration**: Feedback is automatically created as a task in Jira, assigned to the dashboard owner, and prioritized based on urgency.
- **Real-Time Comments**: Owners and users can leave comments via Tableau and Slack, allowing for a cross-platform chat experience.
- **Image Upload and Screenshots**: Users can attach screenshots of the dashboard or upload additional images when submitting feedback.
- **Track Previous Feedback**: Users can track and review previous feedback they've submitted.

```bash
Feedback_Extension/
│
├── index.html            # Feedback Form UI
├── tracker.html          # Feedback Tracking Dashboard UI
├── style.css             # Custom styles for the entire extension
├── script.js             # JavaScript handling logic for both UIs
├── manifest.json         # Extension manifest file
└── README.md             # Documentation for the extension
