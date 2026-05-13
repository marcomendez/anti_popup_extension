const globalToggle = document.getElementById('globalToggle');
const statusText = document.getElementById('statusText');

chrome.storage.sync.get(['globalEnabled'], (result) => {
  const isEnabled = result.globalEnabled === true;
  globalToggle.checked = isEnabled;
  statusText.textContent = isEnabled ? 'Activada' : 'Desactivada';
});

globalToggle.addEventListener('change', async (e) => {
  const isEnabled = e.target.checked;
  await chrome.storage.sync.set({ globalEnabled: isEnabled });
  statusText.textContent = isEnabled ? 'Activada' : 'Desactivada';
});