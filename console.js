// console.js
(function () {
  const currentScript = document.currentScript || [...document.scripts].pop();
  const baseUrl = currentScript.src.split('/').slice(0, -1).join('/');

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `${baseUrl}/console.css`; // 👈 same dir as the script
  css.onerror = () => console.warn('⚠️ console.css failed to load');
  document.head.appendChild(css);


  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="console-toggle">☰</div>
      <div id="mobile-console">
        <div id="console-tabs">
          <button data-tab="console" class="active">Console</button>
          <button data-tab="network">Network</button>
          <button data-tab="storage">Storage</button>
          <button data-tab="info">System</button>
          <button data-tab="dom">DOM</button>
          <button data-tab="repl">REPL</button>
        </div>
        <div id="panel-console" class="console-panel"></div>
        <div id="panel-network" class="console-panel hidden"></div>
        <div id="panel-storage" class="console-panel hidden"></div>
        <div id="panel-info" class="console-panel hidden"></div>
        <div id="panel-dom" class="console-panel hidden"></div>
        <div id="panel-repl" class="console-panel hidden">
          <div id="repl-output"></div>
          <input id="repl-input" placeholder="Type JS and press Enter"/>
        </div>
      </div>
    `);

    const panels = {
      console: document.getElementById('panel-console'),
      network: document.getElementById('panel-network'),
      storage: document.getElementById('panel-storage'),
      info: document.getElementById('panel-info'),
      dom: document.getElementById('panel-dom'),
      repl: document.getElementById('panel-repl'),
    };
    const toggleBtn = document.getElementById('console-toggle');
    const consoleContainer = document.getElementById('mobile-console');
    const tabs = document.querySelectorAll('#console-tabs button');

    toggleBtn.addEventListener('click', () => {
      consoleContainer.style.display = consoleContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    tabs.forEach(btn => btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(panels).forEach(p => p.classList.add('hidden'));
      panels[btn.dataset.tab].classList.remove('hidden');
    }));

    function logTo(panel, type, content) {
      const el = document.createElement('div');
      el.className = type;
      el.innerHTML = content;
      panels[panel].appendChild(el);
      panels[panel].scrollTop = panels[panel].scrollHeight;
    }

    ['log', 'warn', 'error', 'info'].forEach(level => {
      const orig = console[level];
      console[level] = (...args) => {
        const html = args.map(a =>
          typeof a === 'object' ? `<pre>${JSON.stringify(a, null, 2)}</pre>` : a
        ).join(' ');
        logTo('console', `console-${level}`, html);
        orig.apply(console, args);
      };
    });

    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      logTo('network', 'console-log', `➡️ Fetch ${args[0]}`);
      try {
        const res = await origFetch.apply(this, args);
        logTo('network', 'console-log', `✅ ${res.url} [${res.status}]`);
        return res;
      } catch (e) {
        logTo('network', 'console-error', `❌ fetch error: ${e}`);
        throw e;
      }
    };

    const origXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new origXHR();
      xhr.addEventListener('loadstart', () => logTo('network', 'console-log', `➡️ XHR ${xhr.responseURL}`));
      xhr.addEventListener('load', () => logTo('network', 'console-log', `✅ XHR ${xhr.responseURL} [${xhr.status}]`));
      xhr.addEventListener('error', () => logTo('network', 'console-error', `❌ XHR error ${xhr.responseURL}`));
      return xhr;
    };

    function refreshStorage() {
      panels.storage.innerHTML = '';
      ['localStorage', 'sessionStorage'].forEach(k => {
        const pre = JSON.stringify(Object.fromEntries(Object.entries(window[k])), null, 2);
        logTo('storage', 'console-log', `<strong>${k}:</strong><pre>${pre}</pre>`);
      });
      if (window.indexedDB?.databases) {
        window.indexedDB.databases().then(dbs =>
          dbs.forEach(db => logTo('storage', 'console-log', `<strong>IndexedDB:</strong> ${db.name}`))
        );
      }
    }
    refreshStorage();
    window.addEventListener('storage', refreshStorage);

    ['info'].forEach(_ => {
      logTo('info', 'console-log', `<strong>Screen:</strong> ${screen.width}×${screen.height}`);
      logTo('info', 'console-log', `<strong>UserAgent:</strong> ${navigator.userAgent}`);
      logTo('info', 'console-log', `<strong>Platform:</strong> ${navigator.platform}`);
    });

    function buildTree(el, indent = 0) {
      let out = ' '.repeat(indent) + `<${el.tagName.toLowerCase()}`;
      if (el.id) out += ` id="${el.id}"`;
      if (el.className) out += ` class="${el.className}"`;
      out += '>';
      logTo('dom', 'console-log', out);
      el.childNodes.forEach(c => c.nodeType === 1 && buildTree(c, indent + 2));
    }
    buildTree(document.body);

    const replInput = document.getElementById('repl-input');
    replInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const code = replInput.value.trim();
        if (!code) return;
        try {
          const result = eval(code);
          logTo('repl', 'console-log', `<span>> ${code}</span><pre>${JSON.stringify(result, null, 2)}</pre>`);
        } catch (err) {
          logTo('repl', 'console-error', `<span>> ${code}</span><pre>${err}</pre>`);
        }
        replInput.value = '';
      }
    });

    console.log('Console ✅ loaded');
  });
})();
