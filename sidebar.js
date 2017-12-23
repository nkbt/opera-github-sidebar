const e = (...args) => document.querySelector(...args);


const options = {
};


const render = url => {
  e('[data-app]').innerHTML = url;
};


const maybeRender = () => {
  if (!Object.keys(options).length) {
    return;
  }
  chrome.tabs.query({
    'currentWindow': true,
    'active': true,
    'url': 'https://github.com/*'
  }, ([{url} = {}]) => url && render(url));
};


const restoreSettings = () =>
  chrome.storage.local.get(null, opts => {
    Object.assign(options, opts);
    maybeRender();
  });


const updateSettings = changes => {
  Object.keys(changes).forEach(key => Object.assign(options, {[key]: changes[key].newValue}));
  maybeRender();
};


window.addEventListener('load', restoreSettings, false);
chrome.storage.onChanged.addListener(updateSettings);

chrome.tabs.onUpdated.addListener(maybeRender);
chrome.tabs.onActivated.addListener(maybeRender);
