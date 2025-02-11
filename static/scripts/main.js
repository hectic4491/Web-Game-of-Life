$(document).ready(function() {
  console.log(`executing main.js`)
  // Load JavaScript files
  loadScript('static/scripts/script.js')
  loadScript('static/scripts/ux-design.js')
  loadScript('static/scripts/move-grid.js')
  //... Add more as needed...


  // Load function
  function loadScript(src) {
    let script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
    console.log(`loading ${src} from main.js...`);
  }
});