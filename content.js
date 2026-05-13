let globalEnabled = false;

function shouldBlock() {
  return globalEnabled;
}

chrome.storage.sync.get(['globalEnabled'], (result) => {
  globalEnabled = result.globalEnabled === true;
});

const originalWindowOpen = window.open;

window.open = function() {
  if (shouldBlock()) {
    return null;
  }
  return originalWindowOpen.apply(this, arguments);
};

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

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (changes.globalEnabled) {
    globalEnabled = changes.globalEnabled.newValue === true;
  }
});