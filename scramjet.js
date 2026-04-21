const _uvBase = 'https://webprogy123.vercel.app';

let _uvReady = false;

async function initUV() {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js', { scope: '/classes/' });
    await new Promise(r => {
      if (navigator.serviceWorker.controller) { _uvReady = true; r(); return; }
      navigator.serviceWorker.addEventListener('controllerchange', () => { _uvReady = true; r(); }, { once: true });
    });
    window.dispatchEvent(new Event('uv-ready'));
  } catch(e) {
    console.warn('UV SW failed', e);
  }
}

async function loadConfig() {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = _uvBase + '/class/uv.config.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function uvUrl(url) {
  if (typeof __uv$config !== 'undefined') {
    return '/classes/math/' + __uv$config.encodeUrl(url);
  }
  return url;
}

function scramjetUrl(url) {
  return uvUrl(url);
}

async function navigateWhenReady(iframe, url) {
  if (url.includes('duckduckgo.com')) { iframe.src = url; return; }
  if (_uvReady && typeof __uv$config !== 'undefined') {
    iframe.src = uvUrl(url);
    return;
  }
  await new Promise(r => window.addEventListener('uv-ready', r, { once: true }));
  iframe.src = uvUrl(url);
}

loadConfig().then(initUV).catch(e => console.warn('UV init failed', e));
