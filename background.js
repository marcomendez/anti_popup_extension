let globalEnabled = false;

chrome.storage.sync.get(['globalEnabled'], (result) => {
  if (result.globalEnabled) {
    globalEnabled = result.globalEnabled;
  }
});

chrome.tabs.onCreated.addListener(async (newTab) => {
  if (!newTab.openerTabId) return;
  if (!globalEnabled) return;

  try {
    const openerTab = await chrome.tabs.get(newTab.openerTabId);
    if (!openerTab || !openerTab.url) return;
    
    const openerUrl = new URL(openerTab.url);
    if (openerUrl.protocol === 'chrome-extension:') return;
    
    await chrome.tabs.remove(newTab.id);
  } catch (e) {}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    if (!globalEnabled) return;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    sendResponse({ globalEnabled: globalEnabled });
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (changes.globalEnabled) {
    globalEnabled = changes.globalEnabled.newValue === true;
  }
});