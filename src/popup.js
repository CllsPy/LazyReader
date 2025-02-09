// popup.js
// Load saved API key when popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['mistralApiKey'], (result) => {
    if (result.mistralApiKey) {
      document.getElementById('apiKey').value = result.mistralApiKey;
      document.getElementById('status').style.display = 'block';
    }
  });
});

document.getElementById('saveKey').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value;
  if (!apiKey) {
    alert('Please enter an API key');
    return;
  }

  // Save to local storage instead of sync
  chrome.storage.local.set({ mistralApiKey: apiKey }, () => {
    document.getElementById('status').style.display = 'block';
    // Verify the save
    chrome.storage.local.get(['mistralApiKey'], (result) => {
      if (result.mistralApiKey === apiKey) {
        console.log('API key saved successfully');
      }
    });
  });
});
