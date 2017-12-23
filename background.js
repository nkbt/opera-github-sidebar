window.addEventListener('load', () =>
  chrome.storage.sync.get('test', saved =>
    chrome.storage.sync.set({
      test: saved.test || 'OMG',
    })), false);