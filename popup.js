const DEFAULT_SETTINGS = {
  theme: "light",
  width: "standard",
  type: "editorial",
  size: "default",
  code: "normal"
};

const fields = ["theme", "width", "type", "size", "code"];
const statusEl = document.querySelector("#status");
const toggleButton = document.querySelector("#toggleReader");
const copyButton = document.querySelector("#copyMarkdown");

init();

async function init() {
  const settings = await loadSettings();
  fields.forEach((field) => {
    const input = document.querySelector(`#${field}`);
    input.value = settings[field];
    input.addEventListener("change", () => updateSetting(field, input.value));
  });

  toggleButton.addEventListener("click", () => sendMessage({ type: "READABLE_MARK_TOGGLE" }));
  copyButton.addEventListener("click", () => sendMessage({ type: "READABLE_MARK_COPY_MARKDOWN" }));

  const status = await sendMessage({ type: "READABLE_MARK_GET_STATUS" }, false);
  if (status?.active) {
    setStatus("Reader active. Controls update live.");
    toggleButton.textContent = "Close Reader";
  }
}

async function updateSetting(field, value) {
  const settings = { ...(await loadSettings()), [field]: value };
  await chrome.storage.local.set({ readableMarkSettings: settings });
  await sendMessage({ type: "READABLE_MARK_APPLY_SETTINGS", settings }, false);
  setStatus(`${labelize(field)} set to ${labelize(value)}.`);
}

async function loadSettings() {
  const result = await chrome.storage.local.get("readableMarkSettings");
  return normalizeSettings({ ...DEFAULT_SETTINGS, ...(result.readableMarkSettings || {}) });
}

async function sendMessage(message, showErrors = true) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !tab.url || /^(chrome|edge|brave|opera|vivaldi|about|devtools):/i.test(tab.url)) {
    if (showErrors) {
      setStatus("This page cannot run extensions.");
    }
    return null;
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, message);
    if (message.type === "READABLE_MARK_TOGGLE") {
      toggleButton.textContent = response?.active ? "Close Reader" : "Open Reader";
      setStatus(response?.active ? "Reader active." : "Reader closed.");
    }
    if (message.type === "READABLE_MARK_COPY_MARKDOWN") {
      setStatus(response?.copied ? "Markdown copied." : "Open Reader before copying.");
    }
    return response;
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
      return await sendMessage(message, showErrors);
    } catch (_injectionError) {
      if (showErrors) {
        setStatus("Could not attach to this page.");
      }
      return null;
    }
  }
}

function setStatus(text) {
  statusEl.textContent = text;
}

function labelize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
}

function normalizeSettings(settings) {
  const normalized = { ...settings };

  if (normalized.theme === "paper") {
    normalized.theme = "light";
  }

  if (normalized.theme === "ink" || normalized.theme === "terminal") {
    normalized.theme = "dark";
  }

  return normalized;
}
