(function () {
  const currentScript = document.currentScript || [...document.scripts].pop();
  const baseUrl = currentScript.src.split('/').slice(0, -1).join('/');

  // Load external CSS (fallback inline on error)
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `${baseUrl}/console.css`;
  css.onerror = () => {
    console.warn('⚠️ console.css failed to load — using fallback CSS');
    const style = document.createElement('style');
    style.textContent = `
      #console-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        background: black;
        color: white;
        padding: 10px;
        font-size: 20px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
      }
      #mobile-console {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40%;
        background: #1e1e1e;
        color: white;
        font-family: monospace;
        display: none;
        flex-direction: column;
        z-index: 9999;
      }
      .console-panel.hidden { display: none; }
      .console-panel { flex: 1; overflow: auto; padding: 10px; }
      #console-tabs { display: flex; border-bottom: 1px solid #444; }
      #console-tabs button { flex: 1; background: none; border: none; color: white; padding: 8px; cursor: pointer; }
      #console-tabs .active { background: #333; }
      #repl-input { width: 100%; padding: 8px; background: black; color: white; border: none; font-family: monospace; }
      .light-mode #mobile-console { background: #eee; color: black; }
      .light-mode #console-tabs button { color: black; }
      .light-mode #repl-input { background: white; color: black; }
    `;
    document.head.appendChild(style);
  };
  document.head.appendChild(css);

  // Ensure setup runs even if DOMContentLoaded already fired
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupConsole);
  } else {
    setupConsole();
  }

  function setupConsole() {
    // Prevent Duplicate Panels
    if (document.getElementById('mobile-console')) {
      console.warn('🚫 Console already injected.');
      return;
    }
    
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
          <button id="toggle-theme">🌙</button>
        </div>
        <div id="panel-console" class="console-panel" data-panel="console"></div>
        <div id="panel-network" class="console-panel hidden" data-panel="network"></div>
        <div id="panel-storage" class="console-panel hidden" data-panel="storage"><div style="margin-top: 0.5em;">
  <input id="idb-filter" placeholder="🔍 filter keys or values…" style="width: 100%;" />
</div>
<div style="margin-top: 0.5em;">
  <button id="idb-add">➕ Add Key</button>
  <button id="idb-del">🗑️ Delete Key</button>
</div>
</div>
        <div id="panel-info" class="console-panel hidden" data-panel="info"></div>
        <div id="panel-dom" class="console-panel hidden" data-panel="dom"></div>
        <div id="panel-repl" class="console-panel hidden" data-panel="repl">
          <div id="repl-output"></div>
          <input id="repl-input" placeholder="Type JS and press Enter"/>
        </div>
      </div>
    `);

const panels = {};
  document.querySelectorAll('[data-panel]').forEach(el => {
    panels[el.dataset.panel] = el;
  });
    
  function logTo(panel, type, content) {
    const el = document.createElement('div');
    el.className = type;
    el.innerHTML = content;
    panels[panel].appendChild(el);
    panels[panel].scrollTop = panels[panel].scrollHeight;
  }
    

 
    const consoleContainer = document.getElementById('mobile-console');
    const tabs = document.querySelectorAll('#console-tabs button[data-tab]');

    tabs.forEach(btn => btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(panels).forEach(p => p.classList.add('hidden'));
      panels[btn.dataset.tab].classList.remove('hidden');
      if (btn.dataset.tab === 'storage') {
        loadIndexedDBExplorer();
      }
    }));
const toggleBtn = document.getElementById('console-toggle');
    
           toggleBtn.addEventListener('click', () => {
      consoleContainer.style.display = consoleContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    document.getElementById('toggle-theme').addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
    });
    
    // Helper for REPL use 
    window.consoleDumpStore = function (dbName, storeName) {
      const req = indexedDB.open(dbName);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const all = store.getAll();
        all.onsuccess = () => {
         const html = sortAndRenderStoreData(all.result, `Contents of ${storeName}`);
logTo('storage', 'console-log', html);

        };
        tx.oncomplete = () => db.close();
      };
      req.onerror = () => {
        logTo('storage', 'console-error', `❌ Failed to open DB: ${dbName}`);
      };
    };

 
    // Filter / Add / Delete / Sort to IndexedDB Viewer
    document.getElementById('idb-filter').addEventListener('input', () => {
      const filter = document.getElementById('idb-filter').value.toLowerCase();
      const pre = resultBox.querySelector('pre');
      if (!pre) return;
      const original = JSON.parse(pre.textContent || '[]');
      const filtered = original.filter(entry =>
        JSON.stringify(entry).toLowerCase().includes(filter)
      );
      resultBox.innerHTML = `<pre>${JSON.stringify(filtered, null, 2)}</pre>`;
    });

   document.getElementById('idb-add').addEventListener('click', () => {
  const dbName = dbSelect.value;
  const storeName = storeSelect.value;
  if (!dbName || !storeName) return;

  const key = prompt('Enter key (leave blank for auto):');
  const value = prompt('Enter JSON value:');
  if (!value) return alert('❌ No value entered');

  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (e) {
    return alert('❌ Invalid JSON format');
  }

 const panels = {
      console: document.getElementById('panel-console'),
      network: document.getElementById('panel-network'),
      storage: document.getElementById('panel-storage'),
      info: document.getElementById('panel-info'),
      dom: document.getElementById('panel-dom'),
      repl: document.getElementById('panel-repl'),
    };

  function refreshStorage() {
    panels.storage.innerHTML = `
  <div style="margin-bottom: 0.5em;">
    <label>📦 DB:
      <select id="idb-dbs"><option>Loading…</option></select>
    </label>
    <label>📁 Store:
      <select id="idb-stores" disabled><option>Select DB first</option></select>
    </label>
  </div>
  <div id="idb-results"></div>
`;

    ['localStorage', 'sessionStorage'].forEach(k => {
      const pre = JSON.stringify(Object.fromEntries(Object.entries(window[k])), null, 2);
      logTo('storage', 'console-log', `<strong>${k}:</strong><pre>${pre}</pre>`);
    });
    if (indexedDB.databases) {
      indexedDB.databases().then(dbs => {
        dbs.forEach(db => {
          logTo('storage', 'console-log', `<strong>IndexedDB:</strong> ${db.name || '(unnamed)'}`);

          const req = indexedDB.open(db.name);
          req.onsuccess = () => {
            const dbInstance = req.result;
            const stores = dbInstance.objectStoreNames;
            for (let i = 0; i < stores.length; i++) {
              logTo('storage', 'console-log', `&nbsp;&nbsp;↳ Store: ${stores[i]}`);
            }
            dbInstance.close();
          };
          req.onerror = () => {
            logTo('storage', 'console-error', `❌ Error opening DB ${db.name}`);
          };
        });
      });
    }
  }
  refreshStorage();
  window.addEventListener('storage', refreshStorage);
     
  const req = indexedDB.open(dbName);
  req.onsuccess = () => {
    const db = req.result;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    if (key) {
      store.put(parsed, key);
    } else {
      store.add(parsed);
    }
    tx.oncomplete = () => {
      db.close();
      storeSelect.dispatchEvent(new Event('change'));
    };
  };
  req.onerror = () => alert('❌ Failed to open database');
});


document.getElementById('idb-del').addEventListener('click', () => {
  const dbName = dbSelect.value;
  const storeName = storeSelect.value;
  const key = prompt('Enter key to delete:');
  if (!key) return;

  if (!confirm(`Are you sure you want to delete key: ${key}?`)) return;

  const req = indexedDB.open(dbName);
  req.onsuccess = () => {
    const db = req.result;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(key);
    tx.oncomplete = () => {
      db.close();

      // ✅ Refresh the view after deletion
      const refreshTx = db.transaction(storeName, 'readonly');
      const refreshStore = refreshTx.objectStore(storeName);
      const all = refreshStore.getAll();
      all.onsuccess = () => {
        resultBox.innerHTML = sortAndRenderStoreData(
          all.result,
          `Contents of ${storeName}`,
          resultBox
        );
      };
    };
  };
  req.onerror = () => alert('❌ Failed to open database');
});


    // --- [1] JS Error Catcher ---
    window.onerror = (msg, url, line, col, err) =>
      logTo('console', 'console-error', `<strong>JS Error:</strong> ${msg}<br><pre>${err?.stack}</pre>`);
    window.onunhandledrejection = e =>
      logTo('console', 'console-error', `<strong>Unhandled Promise:</strong> <pre>${e.reason?.stack || e.reason}</pre>`);

    // --- [2] Enhanced Network Inspector ---
    const origFetch = window.fetch?.bind(window);
    if (origFetch) {
      window.fetch = async (...args) => {
        const [resource, config] = args;
        logTo('network', 'console-log', `➡️ Fetch ${resource}`);
        const res = await origFetch(...args);
        const clone = res.clone();
        let body = '';
        try { body = await clone.text(); } catch { }
        logTo('network', 'console-log',
          `✅ ${res.url} [${res.status}]<pre>${body}</pre>`);
        return res;
      };
    }
    const origXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new origXHR();
      xhr.addEventListener('load', () => {
        const body = xhr.responseText.substring(0, 200);
        logTo('network', 'console-log',
          `✅ XHR ${xhr.responseURL} [${xhr.status}]<pre>${body}${xhr.responseText.length > 200 ? '…' : ''}</pre>`);
      });
      return xhr;
    };

    // --- [3] Performance Watcher ---
    let lastFrame = performance.now();
    function perfLoop() {
      const now = performance.now();
      const delta = now - lastFrame;
      if (delta > 100) {
        logTo('info', 'console-warn', `⚠️ Long frame: ${delta.toFixed(1)}ms`);
      }
      lastFrame = now;
      requestAnimationFrame(perfLoop);
    }
    perfLoop();

    // --- [4] Element Picker ---
    document.addEventListener('click', e => {
      if (!e.target.closest('#mobile-console')) {
        document.querySelectorAll('.highlight-picked').forEach(el =>
          el.classList.remove('highlight-picked'));
        const el = e.target;
        el.classList.add('highlight-picked');
        logTo('dom', 'console-log', `<pre>${el.outerHTML.split('\n')[0]}…</pre>`);
      }
    }, true);

    // --- [5] DOM Inspector using <details> tree ---
    function buildDomTree(el) {
      const d = document.createElement('details');
      const s = document.createElement('summary');
      const id = el.id ? `#${el.id}` : '';
      const cls = el.className ? '.' + el.className.split(' ').join('.') : '';
      s.textContent = `<${el.tagName.toLowerCase()}${id}${cls}>`;
      d.appendChild(s);
      Array.from(el.children).forEach(child => {
        d.appendChild(buildDomTree(child));
      });
      return d;
    }
    const domPanel = document.getElementById('panel-dom');
    domPanel.innerHTML = '';
    domPanel.appendChild(buildDomTree(document.body));

    console.log('✅ Mobile Console Loaded');
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
   

  logTo('info', 'console-log', `<strong>Screen:</strong> ${screen.width}×${screen.height}`);
  logTo('info', 'console-log', `<strong>UserAgent:</strong> ${navigator.userAgent}`);
  logTo('info', 'console-log', `<strong>Platform:</strong> ${navigator.platform}`);

  function buildTree(el) {
    const container = document.createElement('div');
    container.className = 'dom-tree';

    function createNodeElement(el) {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? ` id="${el.id}"` : '';
      const cls = el.className ? ` class="${el.className}"` : '';
      const children = [...el.children];

      const wrapper = document.createElement('div');
      wrapper.className = 'dom-node';

      const label = document.createElement('div');
      label.className = 'dom-node-label';
      label.innerHTML = `<span class="dom-arrow">${children.length ? '▶' : ''}</span> &lt;${tag}${id}${cls}&gt;`;

      wrapper.appendChild(label);

      if (children.length) {
        const childContainer = document.createElement('div');
        childContainer.className = 'dom-children';
        childContainer.style.display = 'none';

        children.forEach(child => {
          const childNode = createNodeElement(child);
          childContainer.appendChild(childNode);
        });

        wrapper.appendChild(childContainer);

        label.addEventListener('click', () => {
          const arrow = label.querySelector('.dom-arrow');
          const isOpen = childContainer.style.display === 'block';
          childContainer.style.display = isOpen ? 'none' : 'block';
          arrow.textContent = isOpen ? '▶' : '▼';
        });
      }

      return wrapper;
    }

    const rootNode = createNodeElement(document.body);
    container.appendChild(rootNode);
    panels.dom.innerHTML = '';
    panels.dom.appendChild(container);
  }
  buildTree(document.body);
  const dbSelect = document.getElementById('idb-dbs');
  const storeSelect = document.getElementById('idb-stores');
  const resultBox = document.getElementById('idb-results');

  async function loadIndexedDBExplorer() {
    dbSelect.innerHTML = '';
    const dbs = await indexedDB.databases();
    if (!dbs.length) {
      dbSelect.innerHTML = '<option>No IndexedDB found</option>';
      dbSelect.disabled = true;
      return;
    }

    dbs.forEach(db => {
      const opt = document.createElement('option');
      opt.value = db.name;
      opt.textContent = db.name || '(unnamed)';
      dbSelect.appendChild(opt);
    });

    dbSelect.disabled = false;
    storeSelect.disabled = true;
    storeSelect.innerHTML = '<option>Select DB first</option>';
  }

  dbSelect.addEventListener('change', () => {
    const dbName = dbSelect.value;
    if (!dbName) return;

    const req = indexedDB.open(dbName);
    req.onsuccess = () => {
      const db = req.result;
      storeSelect.innerHTML = '';
      for (const storeName of db.objectStoreNames) {
        const opt = document.createElement('option');
        opt.value = storeName;
        opt.textContent = storeName;
        storeSelect.appendChild(opt);
      }
      storeSelect.disabled = false;
      db.close();
    };
  });

  storeSelect.addEventListener('change', () => {
    const dbName = dbSelect.value;
    const storeName = storeSelect.value;
    if (!dbName || !storeName) return;

    const req = indexedDB.open(dbName);
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const all = store.getAll();
     all.onsuccess = () => {
  resultBox.innerHTML = sortAndRenderStoreData(all.result, `Contents of ${storeName}`, resultBox);
};

      tx.oncomplete = () => db.close();
    };
  });

  // Load DBs on startup
  if (indexedDB.databases) {
    loadIndexedDBExplorer();
  }

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
  // --- Auto-reinject on DOM or URL change ---
  (function monitorConsole() {
    let lastUrl = location.href;

    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('🔄 URL changed — re-injecting console');
        if (!document.getElementById('mobile-console')) {
          setupConsole(); // re-run setup if UI is gone
        }
      } else {
        // Check in case DOM was wiped (but URL unchanged)
        if (!document.getElementById('console-toggle')) {
          console.log('🔄 Console UI missing — re-injecting');
          setupConsole();
        }
      }
    }, 1000); // Check every second
  })();
  
function sortAndRenderStoreData(storeData, title = '', renderTo = null) {
  try {
    const sorted = [...storeData].sort((a, b) => {
      const ak = a.id ?? a.key ?? JSON.stringify(a);
      const bk = b.id ?? b.key ?? JSON.stringify(b);
      return String(ak).localeCompare(String(bk));
    });

    const html = `<strong>${title}</strong><pre>${JSON.stringify(sorted, null, 2)}</pre>`;

    if (renderTo) {
      renderTo.innerHTML = html;
    }

    return html;
  } catch (err) {
    return `<strong>Error sorting data</strong><pre>${err.message}</pre>`;
  }
}

  console.log('✅ Mobile Console Loaded');
  console.log('📦 Panels loaded:', Object.keys(panels));

})();
