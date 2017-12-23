const e = (...args) => document.querySelector(...args);

window.addEventListener('load', () =>
  e('[data-app]').innerHTML = 'Loaded', false);