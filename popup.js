const globalToggle = document.getElementById('globalToggle');
const siteToggle = document.getElementById('siteToggle');
const toggleSiteBtn = document.getElementById('toggleSiteBtn');
const globalStatus = document.getElementById('globalStatus');
const siteStatus = document.getElementById('siteStatus');
const currentSiteEl = document.getElementById('currentSite');

let currentDomain = '';

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0] && tabs[0].url) {
    try {
      const url = new URL(tabs[0].url);
      currentDomain = url.hostname;
      currentSiteEl.textContent = currentDomain;
    } catch (e) {
      currentSiteEl.textContent = 'No disponible';
    }
  }
});

chrome.storage.sync.get(['globalEnabled', 'enabledSites'], (result) => {
  const globalEnabled = result.globalEnabled === true;
  const siteEnabled = result.enabledSites && result.enabledSites[currentDomain] === true;

  globalToggle.checked = globalEnabled;
  siteToggle.checked = siteEnabled;
  
  updateUI(globalEnabled, siteEnabled);
});

function updateUI(globalEnabled, siteEnabled) {
  globalStatus.textContent = globalEnabled ? 'Activada' : 'Desactivada';
  siteToggle.disabled = !globalEnabled;
  siteStatus.textContent = globalEnabled ? (siteEnabled ? 'Activado' : 'Desactivado') : 'Global OFF';
  toggleSiteBtn.disabled = !globalEnabled;
  toggleSiteBtn.textContent = siteEnabled ? 'Desactivar este sitio' : 'Activar este sitio';
  toggleSiteBtn.className = siteEnabled ? 'btn off' : 'btn';
}

globalToggle.addEventListener('change', async (e) => {
  const isEnabled = e.target.checked;
  await chrome.storage.sync.set({ globalEnabled: isEnabled });
  
  chrome.storage.sync.get(['enabledSites'], (result) => {
    const siteEnabled = result.enabledSites && result.enabledSites[currentDomain] === true;
    updateUI(isEnabled, siteEnabled);
  });
});

toggleSiteBtn.addEventListener('click', async () => {
  const result = await chrome.storage.sync.get(['enabledSites', 'globalEnabled']);
  const enabledSites = result.enabledSites || {};
  const globalEnabled = result.globalEnabled;

  if (!globalEnabled) return;

  enabledSites[currentDomain] = !enabledSites[currentDomain];
  await chrome.storage.sync.set({ enabledSites });

  const siteEnabled = enabledSites[currentDomain];
  siteToggle.checked = siteEnabled;
  updateUI(globalEnabled, siteEnabled);
});

siteToggle.addEventListener('change', async (e) => {
  const result = await chrome.storage.sync.get(['globalEnabled']);
  if (!result.globalEnabled) {
    e.target.checked = false;
    return;
  }

  const enabledSites = (await chrome.storage.sync.get(['enabledSites'])).enabledSites || {};
  enabledSites[currentDomain] = e.target.checked;
  await chrome.storage.sync.set({ enabledSites });

  siteStatus.textContent = e.target.checked ? 'Activado' : 'Desactivado';
  toggleSiteBtn.textContent = e.target.checked ? 'Desactivar este sitio' : 'Activar este sitio';
  toggleSiteBtn.className = e.target.checked ? 'btn off' : 'btn';
});