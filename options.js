const onLoad = () => {
  const state = {
    options: {}
  };


  const supportedOptions = ['token'];
  const asPassword = ['token'];


  const onValueChange = ({target: {name, value}}) => console.log(`name,value`, name,value) ||
    chrome.storage.local.set({[name]: value});


  const removeUnsupportedOptions = () => new Promise(resolve => {
    const container = document.querySelector(`[data-options]`);

    [...container.querySelectorAll(`label[data-options]`)]
      .filter(label => !supportedOptions.includes(label.dataset.options))
      .forEach(label => container.removeChild(label));

    setTimeout(resolve);
  });


  const addMissingOptions = () => new Promise(resolve => {
    const container = document.querySelector(`[data-options]`);

    const labels = supportedOptions
      .map(key => {
        let label = container.querySelector(`label[data-options="${key}"]`);
        if (!label) {
          label = document.createElement('label');
          label.dataset.options = key;
          const type = asPassword.includes(key) ? 'password' : 'text';
          label.innerHTML = `${key}: <input type="${type}" name="${key}" value="" />`;
          const input = label.querySelector('input');
          input.addEventListener('change', onValueChange, false);
        }
        return label;
      });

    labels.forEach(label => container.appendChild(label));

    setTimeout(resolve);
  });


  const updateValues = () => new Promise(resolve => {
    const container = document.querySelector(`[data-options]`);

    const inputs = supportedOptions
      .map(key => container.querySelector(`input[name="${key}"]`))
      .filter(input => input && input.value !== state.options[input.name]);

    inputs
      .forEach(input => (input.value = state.options[input.name]))

    setTimeout(resolve);
  });


  const render = async () => {
    await removeUnsupportedOptions();
    await addMissingOptions();
    await updateValues();
  };


  const onOptionsChange = options => {
    Object.assign(state, {options});
    render();
  };


  optionsStore(onOptionsChange);
};


window.addEventListener('load', onLoad, false);
