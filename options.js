const e = (...args) => document.querySelector(...args);


// Initial state
const options = {
  token: ''
};


const hide = ['token'];


const render = () => {
  Object.keys(options).forEach(key => {
    let input = e(`[data-options] [data-options="${key}"] input`);
    if (!input) {
      const label = document.createElement('label');
      label.dataset.options = key;
      const type = hide.includes(key) ? 'password' : 'text';
      label.innerHTML = `${key}: <input type="${type}" name="${key}" value="" />`;
      e('[data-options]').appendChild(label);
      input = label.querySelector('input');
    }

    if (input.value !== options[key]) {
      input.value = options[key];
    }
  });
};

const onValueChange = ({target: {name, value}}) =>
  chrome.storage.local.set({[name]: value});


const subscribe = () =>
  e(`[data-options]`).addEventListener('keyup', onValueChange, false);


const restoreSettings = () =>
  chrome.storage.local.get(null, opts => {
    const toRemove = Object.keys(opts).filter(key => !(key in options));
    if (toRemove.length > 0) {
      chrome.storage.local.remove(toRemove);
    }
    Object.keys(options).forEach(key => Object.assign(options, {[key]: opts[key]}));
    render();
  });


const updateSettings = changes =>
  Object.keys(changes).forEach(key => Object.assign(options, {[key]: changes[key].newValue}));


window.addEventListener('load', restoreSettings, false);
chrome.storage.onChanged.addListener(updateSettings);

window.addEventListener('load', subscribe, false);
window.addEventListener('load', render, false);
chrome.storage.onChanged.addListener(render);
