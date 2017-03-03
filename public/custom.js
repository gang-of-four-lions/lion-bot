'use strict';

const hash = window.location.hash;

if (hash) {
  let splashRoot = document.getElementById('splash')
  let splash = document.createElement('div');

  if (hash === '#success') {
    splash.className = "splash splash-success";
    splash.innerHTML = "<h1>SUCCESS!</h1><p>Click anywhere to continue...</p>";
  }
  if (hash === '#failure') {
    splash.className = "splash splash-failure";
    splash.innerHTML = "<h1>FAILURE!</h1><p>Click anywhere to continue...</p>";
  }

  splash.onclick = () => splashRoot.removeChild(splash);

  splashRoot.appendChild(splash);
}