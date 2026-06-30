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
  setWindowSize(sizeKey) {
    return ipcRenderer.invoke('steam-portrait-set-size', sizeKey);
  },
  getWindowSize() {
    return ipcRenderer.invoke('steam-portrait-get-size');
  },
  setSizeClass(className) {
    document.body.classList.remove('steam-portrait-large');
    if (className) document.body.classList.add(className);
    window.dispatchEvent(new Event('resize'));
  }
});

contextBridge.exposeInMainWorld('steamCloud', {
  loadProfile() {
    return ipcRenderer.invoke('steam-cloud-load-profile');
  },
  saveProfile(profile) {
    return ipcRenderer.invoke('steam-cloud-save-profile', profile);
  },
  saveProfileSync(profile) {
    return ipcRenderer.sendSync('steam-cloud-save-profile-sync', profile);
  }
});

contextBridge.exposeInMainWorld('steamAchievements', {
  unlock(achievementId) {
    return ipcRenderer.invoke('steam-achievement-unlock', achievementId);
  }
});

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal(url) {
    return ipcRenderer.invoke('open-external-url', url);
  }
});
