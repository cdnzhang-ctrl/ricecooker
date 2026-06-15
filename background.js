const TOGGLE_MESSAGE = { type: "READABLE_MARK_TOGGLE" };

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-reader") {
    sendToActiveTab(TOGGLE_MESSAGE);
  }
});

async function sendToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !tab.url || isRestrictedUrl(tab.url)) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, message);
  } catch (_error) {
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["reader.css"]
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      await chrome.tabs.sendMessage(tab.id, message);
    } catch (_injectionError) {
      // Some pages, such as browser internals and web store pages, do not allow injection.
    }
  }
}

function isRestrictedUrl(url) {
  return /^(chrome|edge|brave|opera|vivaldi|about|devtools):/i.test(url);
}
