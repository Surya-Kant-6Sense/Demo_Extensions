/*
  Name: script.js
  Purpose: Handles logic for both Feedback Form and Tracking Dashboard UIs
  Author: Surya Kant Mani
  Date: September 26, 2024
  Version: 1.0.0
  Developer Notes: This script handles all JavaScript functionality for the 6Sight Feedback Extension, including form submission, data visualization, and chat functionality.
*/

document.addEventListener('DOMContentLoaded', function() {
  tableau.extensions.initializeAsync().then(() => {
    const dashboard = tableau.extensions.dashboardContent.dashboard;

    // Initialize the feedback form and dashboard
    initializeFeedbackForm(dashboard);
    loadFeedbackData(); // Load feedback data into dashboard

    // Setup clock and user name
    initializeClock();
    document.getElementById('username-display').textContent = tableau.extensions.environment.context.user.fullName;
    
    // Event listener for comment submission
    document.getElementById('submit-comment').addEventListener('click', submitComment);
  });
});

// Initialize the feedback form with dynamic data
function initializeFeedbackForm(dashboard) {
  document.getElementById('dashboard').value = dashboard.workbook.name;
  document.getElementById('screen').value = dashboard.name;

  loadSheets(dashboard); // Load sheets into the "View" dropdown

  document.getElementById('no-view').addEventListener('change', handleNoViewCheck);
}

// Populate sheets for the "View" dropdown
function loadSheets(dashboard) {
  const sheetDropdown = document.getElementById('view');
  dashboard.worksheets.forEach(sheet => {
    const option = document.createElement('option');
    option.textContent = sheet.name;
    sheetDropdown.appendChild(option);
  });
}

// Handle "Not related to any view" checkbox change
function handleNoViewCheck() {
  const isChecked = document.getElementById('no-view').checked;
  const viewDropdown = document.getElementById('view');
  viewDropdown.disabled = isChecked; // Disable if "Not related" is checked
}

// Load feedback data for the tracking dashboard
function loadFeedbackData() {
  tableau.extensions.dashboardContent.dashboard.worksheets.forEach(worksheet => {
    if (worksheet.name === 'Feedbacks') {
      worksheet.getSummaryDataAsync().then(feedbackData => {
        populateTable(feedbackData.data);
        renderCharts(feedbackData.data);
      });
    }
  });
}

// Populate feedback table with data
function populateTable(feedbackData) {
  const feedbackTableBody = document.getElementById('feedback-table-body');
  feedbackTableBody.innerHTML = '';
  feedbackData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row[0]}</td>
      <td>${row[3]}</td>
      <td>${row[5]}</td>
      <td>${row[4]}</td>
      <td>${row[6]}</td>
      <td>${row[8]}</td>
    `;
    feedbackTableBody.appendChild(tr);
  });
}

// Render charts (area chart and donut charts)
function renderCharts(feedbackData) {
  renderAreaChart(feedbackData);
  renderDonutCharts(feedbackData);
}

// Render area chart for feedback submissions over time
function renderAreaChart(feedbackData) {
  const ctx = document.getElementById('areaChart').getContext('2d');
  const data = {
    labels: feedbackData.map(row => row[8]),
    datasets: [{
      label: 'Feedback Submissions',
      data: feedbackData.map(row => row[8]),
      fill: true,
      backgroundColor: 'rgba(19, 187, 178, 0.2)',
      borderColor: '#13bbb2',
      tension: 0.4
    }]
  };
  const config = {
    type: 'line',
    data: data,
    options: {
      scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
      plugins: {
        tooltip: { callbacks: { label: tooltipItem => `Feedbacks: ${tooltipItem.raw}` } }
      }
    }
  };
  new Chart(ctx, config);
}

// Render donut charts for feedback breakdown by status and type
function renderDonutCharts(feedbackData) {
  const statusCtx = document.getElementById('statusDonutChart').getContext('2d');
  const typeCtx = document.getElementById('typeDonutChart').getContext('2d');

  const statusData = {
    labels: ['Pending', 'In-Progress', 'Closed'],
    datasets: [{
      data: feedbackData.map(row => row[5]),
      backgroundColor: ['#ff583d', '#13bbb2', '#192232']
    }]
  };

  const typeData = {
    labels: ['Feature Request', 'Data Anomaly', 'General Feedback', 'UI Enhancement'],
    datasets: [{
      data: feedbackData.map(row => row[3]),
      backgroundColor: ['#13bbb2', '#ff583d', '#192232', '#c5cfd6']
    }]
  };

  new Chart(statusCtx, { type: 'doughnut', data: statusData });
  new Chart(typeCtx, { type: 'doughnut', data: typeData });
}

// Initialize the digital clock
function initializeClock() {
  const clock = document.getElementById('clock');
  setInterval(() => {
    const now = luxon.DateTime.now().toLocaleString(luxon.DateTime.TIME_WITH_SECONDS);
    clock.textContent = now;
  }, 1000);
}

// Submit comment in the chat section
function submitComment() {
  const comment = document.getElementById('chat-input').value;
  const chatBox = document.getElementById('chat-box');
  const message = document.createElement('p');
  message.textContent = `You: ${comment}`;
  chatBox.appendChild(message);
  document.getElementById('chat-input').value = ''; // Clear the input
}
