document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString();
    
    if (selectedText.length > 0) {
      chrome.storage.local.set({ selectedText: selectedText }, () => {
        console.log('Selected text stored:', selectedText);
      });
    }
  });
  