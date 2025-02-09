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
                "content": "Você é um assistente cuidadoso que sumariza textos"
              },
              {
                "role": "user",
                "content": `Por favor, sumarize este texto em não mais que 250 palavras. No idioma pt-br: ${selectedText}`
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Decodificar a resposta como UTF-8
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(buffer);
        const data = JSON.parse(text);

        if (data.choices && data.choices[0]) {
          const summary = data.choices[0].message.content;

          // Criar uma janela popup para exibir o resumo
          await chrome.windows.create({
            url: `data:text/html,
              <html>
                <head>
                  <meta charset="utf-8" />
                </head>
                <body style="padding: 20px; font-family: Arial;">
                  <h3>Resumo:</h3>
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
        alert(`Erro: ${error.message}. Por favor, verifique se sua chave API está correta.`);
      }
    } catch (error) {
      console.error('Storage Error:', error);
      alert('Erro ao acessar a chave API. Por favor, tente configurá-la novamente.');
    }
  }
});
