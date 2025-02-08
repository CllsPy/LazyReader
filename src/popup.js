const summarizeButton = document.getElementById('summarizeBtn');
const summaryText = document.getElementById('summaryText');

// Fetch selected text from storage when the popup is opened
chrome.storage.local.get('selectedText', ({ selectedText }) => {
  if (selectedText) {
    console.log('Selected text retrieved:', selectedText);
    summarizeButton.addEventListener('click', async () => {
      try {
        const response = await fetch('sk-c2e8086adaf84cd3873ddabec9012480', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_DEEPSEEK_API_KEY'
          },
          body: JSON.stringify({ text: selectedText })
        });

        const data = await response.json();

        if (data && data.summary) {
          summaryText.textContent = data.summary;
        } else {
          summaryText.textContent = 'No summary available.';
        }
      } catch (error) {
        summaryText.textContent = 'Error summarizing text: ' + error.message;
      }
    });
  }
});
