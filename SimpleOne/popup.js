document.getElementById("changeColor").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!chrome.scripting) {
        console.error("chrome.scripting API is not available. Check manifest.json.");
        return;
      }
  
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: changeBackgroundColor
      });
    });
  });
  
  function changeBackgroundColor() {
    document.body.style.backgroundColor =
      "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  