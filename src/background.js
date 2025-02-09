// background.js
// Check if API key exists when extension loads
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize selected text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarizeText") {
    try {
      // Get API key from local storage
      const result = await chrome.storage.local.get(['mistralApiKey']);
      const apiKey = result.mistralApiKey;

      if (!apiKey) {
        await chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: 400,
          height: 300
        });
        return;
      }

      const selectedText = info.selectionText;
      
      try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "mistral-tiny",
            messages: [
              {
                "role": "system",
                "content": "You are a helpful assistant that summarizes text concisely."
              },
              {
                "role": "user",
                "content": `Please summarize the following text in a concise way: ${selectedText}`
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
          const summary = data.choices[0].message.content;
          // Create a more user-friendly alert
          await chrome.windows.create({
            url: `data:text/html,
              <html>
                <body style="padding: 20px; font-family: Arial;">
                  <h3>Summary:</h3>
                  <p style="white-space: pre-wrap;">${summary}</p>
                </body>
              </html>`,
            type: 'popup',
            width: 500,
            height: 400
          });
        }
      } catch (error) {
        console.error('API Error:', error);
        alert(`Error: ${error.message}. Please check if your API key is correct.`);
      }
    } catch (error) {
      console.error('Storage Error:', error);
      alert('Error accessing API key. Please try setting it again.');
    }
  }
});