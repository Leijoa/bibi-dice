const { contextBridge, ipcRenderer } = require('electron');

function applySteamPortraitClass(className) {
  window.addEventListener('DOMContentLoaded', () => {
    if (className) document.body.classList.add(className);
  }, { once: true });
}

const params = new URLSearchParams(window.location.search);
applySteamPortraitClass(params.get('steamClass'));

ipcRenderer.on('steam-portrait-size', (_event, payload) => {
  document.body.classList.remove('steam-portrait-large');
  if (payload && payload.className) document.body.classList.add(payload.className);
  window.dispatchEvent(new Event('resize'));
});

contextBridge.exposeInMainWorld('steamPortrait', {
  setSizeClass(className) {
    document.body.classList.remove('steam-portrait-large');
    if (className) document.body.classList.add(className);
    window.dispatchEvent(new Event('resize'));
  }
});
