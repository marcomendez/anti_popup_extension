let enabledSites = {};

chrome.storage.sync.get(['enabledSites'], (result) => {
  if (result.enabledSites) {
    enabledSites = result.enabledSites;
  }
});

function updateTitle(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (!tab || !tab.url) return;
    try {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const isEnabled = enabledSites[domain] === true;

      chrome.action.setTitle({
        tabId: tabId,
        title: isEnabled ? `Anti-Popups: ON (${domain})` : `Anti-Popups: OFF (${domain}) - Click to enable`
      });
    } catch (e) {}
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.url) return;
  try {
    const url = new URL(tab.url);
    const domain = url.hostname;

    enabledSites[domain] = !enabledSites[domain];

    await chrome.storage.sync.set({ enabledSites });

    updateTitle(tab.id);

    chrome.tabs.sendMessage(tab.id, {
      type: 'STATE_CHANGED',
      enabled: enabledSites[domain]
    });
  } catch (e) {}
});

chrome.tabs.onCreated.addListener(async (newTab) => {
  if (!newTab.openerTabId) return;

  chrome.tabs.get(newTab.openerTabId, async (openerTab) => {
    if (!openerTab || !openerTab.url) return;
    try {
      const openerUrl = new URL(openerTab.url);
      const domain = openerUrl.hostname;

      if (enabledSites[domain] === true) {
        const wasUserInitiated = newTab.userInitiated;

        if (!wasUserInitiated) {
          await chrome.tabs.remove(newTab.id);
        }
      }
    } catch (e) {}
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    updateTitle(tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    const domain = message.domain;
    sendResponse({ enabled: enabledSites[domain] === true });
  }
});