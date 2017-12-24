const onLoad = () => {
  const state = {
    options: {},
    url: ''
  };


  const render = () => {
    document.querySelector('[data-app]').innerHTML = state.url;
  };


  const onTabMatch = ([{url = ''} = {}]) => {
    Object.assign(state, {url});
    render();
  };


  const onTabChange = () =>
    chrome.tabs.query({
      'currentWindow': true,
      'active': true,
      'url': 'https://github.com/*'
    }, onTabMatch);


  const onOptionsChange = options => {
    Object.assign(state, {options});
    render();
  };


  optionsStore(onOptionsChange);
  chrome.tabs.onUpdated.addListener(onTabChange);
  chrome.tabs.onActivated.addListener(onTabChange);
};


window.addEventListener('load', onLoad, false);
