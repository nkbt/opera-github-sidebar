const SUPPORTED = ['token'];


const optionsStore = (onChange = () => null) => {
  // Initial state
  const options = SUPPORTED.reduce((memo, key) => Object.assign(memo, {[key]: ''}), {});

  const restoreSettings = () =>
    chrome.storage.local.get(null, opts => {
      const toRemove = Object.keys(opts).filter(key => !SUPPORTED.includes(key));
      if (toRemove.length > 0) {
        chrome.storage.local.remove(toRemove);
      }
      Object.keys(options).forEach(key => Object.assign(options, {[key]: opts[key]}));
      onChange(options);
    });


  const updateSettings = changes => {
    Object.keys(changes).forEach(key => Object.assign(options, {[key]: changes[key].newValue}));
    onChange(options);
  };


  chrome.storage.onChanged.addListener(updateSettings);

  restoreSettings();

  return () => {
    chrome.storage.onChanged.removeListener(updateSettings);
  }
};
