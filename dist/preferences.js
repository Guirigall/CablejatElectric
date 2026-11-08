// Preferència de tema aplicada abans de pintar la pàgina.
(() => {try{const saved=localStorage.getItem('bord-theme')||'system',dark=saved==='dark'||saved==='system'&&matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',dark?'dark':'light')}catch{}})();
