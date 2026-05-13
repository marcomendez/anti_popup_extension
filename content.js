let globalEnabled = false;
let siteEnabled = false;

function shouldBlock() {
  return globalEnabled && siteEnabled;
}

chrome.runtime.sendMessage({ type: 'GET_STATE', domain: window.location.hostname }, (response) => {
  if (response !== undefined) {
    globalEnabled = response.globalEnabled === true;
    siteEnabled = response.siteEnabled === true;
  }
});

window.open = function() {
  if (shouldBlock()) {
    return null;
  }
  return originalWindowOpen.apply(this, arguments);
};

const originalWindowOpen = window.open;

const originalDocumentWrite = document.write;
document.write = function() {
  if (shouldBlock()) return;
  return originalDocumentWrite.apply(this, arguments);
};

window.addEventListener('DOMContentLoaded', function() {
  if (!shouldBlock()) return;

  document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
    if (!link.hasAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
      link.addEventListener('click', function(e) {
        if (!e.isTrusted) return;
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'STATE_CHANGED') {
    siteEnabled = message.enabled;
  }
  if (message.type === 'GLOBAL_STATE_CHANGED') {
    globalEnabled = message.enabled;
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (changes.globalEnabled) {
    globalEnabled = changes.globalEnabled.newValue === true;
  }
});