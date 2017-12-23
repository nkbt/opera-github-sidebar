const e = (...args) => document.querySelector(...args);


// Initial state
const options = {
  token: ''
};


const render = () => {
  Object.keys(options).forEach(key => {
    let input = e(`[data-options] [data-options="${key}"] input`);
    if (!input) {
      const label = document.createElement('label');
      label.dataset.options = key;
      label.innerHTML = `${key}: <input type="text" name="${key}" value=""/>`;
      e('[data-options]').appendChild(label);
      input = label.querySelector('input');
    }

    if (input.value !== options[key]) {
      input.value = options[key];
    }
  });
};

const onValueChange = ({target: {name, value}}) =>
  chrome.storage.sync.set({[name]: value});


const subscribe = () =>
  e(`[data-options]`).addEventListener('keyup', onValueChange, false);


const restoreSettings = () =>
  chrome.storage.sync.get(null, opts => {
    const toRemove = Object.keys(opts).filter(key => !(key in options));
    if (toRemove.length > 0) {
      chrome.storage.sync.remove(toRemove);
    }
    Object.keys(options).forEach(key => Object.assign(options, {[key]: opts[key]}));
    render();
  });


const updateSettings = changes =>
  Object.keys(changes).forEach(key => Object.assign(options, {[key]: changes[key].newValue}));


window.addEventListener('load', restoreSettings, false);
chrome.storage.onChanged.addListener(updateSettings);

window.addEventListener('load', subscribe, false);
window.addEventListener('load', maybeRender, false);
chrome.storage.onChanged.addListener(maybeRender);
