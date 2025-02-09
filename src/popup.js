document.addEventListener('DOMContentLoaded', async () => {
  // Carregar chave API salva
  chrome.storage.local.get(['mistralApiKey'], (result) => {
    if (result.mistralApiKey) {
      document.getElementById('apiKey').value = result.mistralApiKey;
      document.getElementById('status').style.display = 'block';
    }
  });

  // Botão para buscar dados da API
  document.getElementById('fetchData').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
      alert('Por favor, insira uma chave API');
      return;
    }

    try {
      // Chamada à API
      const response = await fetch('URL_DA_API', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });

      // Verificar se a resposta é válida
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
      }

      // Decodificar a resposta
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8'); // Use 'iso-8859-1' se necessário
      const text = decoder.decode(buffer);
      const data = JSON.parse(text);

      // Exibir os dados na página
      document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao buscar dados da API');
    }
  });
});
