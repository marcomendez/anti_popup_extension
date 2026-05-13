let isEnabled = false;

chrome.runtime.sendMessage({ type: 'GET_STATE', domain: window.location.hostname }, (response) => {
  if (response !== undefined && response.enabled !== undefined) {
    isEnabled = response.enabled;
  }
});

window.open = function() {
  if (isEnabled) {
    return null;
  }
  return originalWindowOpen.apply(this, arguments);
};

const originalWindowOpen = window.open;

const originalDocumentWrite = document.write;
document.write = function() {
  if (isEnabled) return;
  return originalDocumentWrite.apply(this, arguments);
};

window.addEventListener('DOMContentLoaded', function() {
  if (!isEnabled) return;

  document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
    if (!link.hasAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
      const originalHref = link.getAttribute('href');
      link.addEventListener('click', function(e) {
        if (!e.isTrusted) return;
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'STATE_CHANGED') {
    isEnabled = message.enabled;
  }
});

window.addEventListener('beforeunload', function() {});