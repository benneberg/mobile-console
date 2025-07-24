(function() {
  const currentScript = document.currentScript || [...document.scripts].pop();
  const baseUrl = currentScript.src.split('/').slice(0, -1).join('/');
  
  // --- Load CSS (fallback inline) ---
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = `${baseUrl}/console.css`;
  css.onerror = () => {
    console.warn('⚠️ console.css failed to load — using fallback CSS');
    const style = document.createElement('style');
    style.textContent = `
      /* Fallback styles... */
      /* (Include your current inline CSS here) */
    `;
    document.head.appendChild(style);
  };
  document.head.appendChild(css);
  
  // --- Initialize UI ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupConsole);
  } else {
    setupConsole();
  }

  let panels = {};  // Global for logTo and tabs

  function setupConsole() {
    if (document.getElementById('mobile-console')) return;

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
        <div id="panel-storage" class="console-panel hidden" data-panel="storage">
          <div><input id="idb-filter" placeholder="🔍 filter…" /></div>
          <div>
            <button id="idb-add">➕ Add Key</button>
            <button id="idb-del">🗑️ Delete Key</button>
          </div>
          <div id="idb-results"></div>
        </div>
        <div id="panel-info" class="console-panel hidden" data-panel="info"></div>
        <div id="panel-dom" class="console-panel hidden" data-panel="dom"></div>
        <div id="panel-repl" class="console-panel hidden" data-panel="repl">
          <div id="repl-output"></div>
          <input id="repl-input" placeholder="Type JS and press Enter"/>
        </div>
      </div>
    `);

    // Map panel elements after insertion
    panels = {};
    document.querySelectorAll('[data-panel]').forEach(el => {
      panels[el.dataset.panel] = el;
    });
    console.log('📦 Panels loaded:', Object.keys(panels));

    const tabs = document.querySelectorAll('#console-tabs button[data-tab]');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.values(panels).forEach(p => p.classList.add('hidden'));
        panels[btn.dataset.tab].classList.remove('hidden');
        if (btn.dataset.tab === 'storage') loadIndexedDBExplorer();
      });
    });

    document.getElementById('console-toggle')
      .addEventListener('click', () => {
        const cont = document.getElementById('mobile-console');
        cont.style.display = cont.style.display === 'flex' ? 'none' : 'flex';
      });

    document.getElementById('toggle-theme')
      .addEventListener('click', () => document.body.classList.toggle('light-mode'));

    setupConsoleFeatures();
  }

  function logTo(panel, type, content) {
    const el = document.createElement('div');
    el.className = type;
    el.innerHTML = content;
    panels[panel].appendChild(el);
    panels[panel].scrollTop = panels[panel].scrollHeight;
  }

  function sortAndRenderStoreData(storeData, title = '', appendTo = null) {
    const sorted = [...storeData].sort((a, b) =>
      JSON.stringify(a).localeCompare(JSON.stringify(b))
    );
    const html = `<strong>${title}</strong><pre>${JSON.stringify(sorted, null, 2)}</pre>`;
    if (appendTo) appendTo.innerHTML = html;
    return html;
  }

  function setupConsoleFeatures() {
    // Console override
    ['log','warn','error','info'].forEach(level => {
      const orig = console[level];
      console[level] = (...args) => {
        const html = args.map(a =>
          typeof a === 'object'
            ? `<pre>${JSON.stringify(a, null, 2)}</pre>`
            : a
        ).join(' ');
        logTo('console', `console-${level}`, html);
        orig.apply(console, args);
      };
    });

    // Error catcher
    window.onerror = (msg, url, line, col, err) =>
      logTo('console', 'console-error', `<strong>JS Error:</strong> ${msg}<br><pre>${err?.stack}</pre>`);
    window.onunhandledrejection = e =>
      logTo('console', 'console-error', `<strong>Unhandled Promise:</strong><pre>${e.reason?.stack||e.reason}</pre>`);

    // Network inspector
    const origFetch = window.fetch;
    if (origFetch) window.fetch = async (...args) => {
      logTo('network', 'console-log', `➡️ Fetch ${args[0]}`);
      const res = await origFetch(...args);
      const clone = res.clone();
      let body = '';
      try { body = await clone.text(); } catch {}
      logTo('network', 'console-log',
        `✅ ${res.url} [${res.status}]<pre>${body}</pre>`);
      return res;
    };
    const origXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new origXHR();
      xhr.addEventListener('load', () => {
        const body = xhr.responseText.substring(0,200);
        logTo('network','console-log',
          `✅ XHR ${xhr.responseURL} [${xhr.status}]<pre>${body}${xhr.responseText.length>200?'…':''}</pre>`);
      });
      return xhr;
    };

    // Performance watcher
    let last = performance.now();
    (function perfLoop(){
      const now = performance.now();
      if (now - last > 100)
        logTo('info','console-warn',`⚠️ Long frame: ${(now-last).toFixed(1)}ms`);
      last = now;
      requestAnimationFrame(perfLoop);
    })();

    // Element picker
    document.addEventListener('click', e => {
      if (!e.target.closest('#mobile-console')) {
        document.querySelectorAll('.highlight-picked')
          .forEach(el => el.classList.remove('highlight-picked'));
        e.target.classList.add('highlight-picked');
        logTo('dom', 'console-log',
          `<pre>${e.target.outerHTML.split('\n')[0]}…</pre>`);
      }
    }, true);

    // DOM inspector
    (function buildDom(){
      const buildNode = el => {
        const d = document.createElement('details');
        const s = document.createElement('summary');
        s.textContent = `<${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${el.className?'.'+el.className.replace(/\s+/g,'.'):''}>`;
        d.appendChild(s);
        [...el.children].forEach(c => d.appendChild(buildNode(c)));
        return d;
      };
      panels.dom.innerHTML = '';
      panels.dom.appendChild(buildNode(document.body));
    })();

    // REPL
    document.getElementById('repl-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const code = e.target.value.trim();
        if (!code) return;
        try {
          const res = eval(code);
          logTo('repl','console-log',`<span>> ${code}</span><pre>${JSON.stringify(res,null,2)}</pre>`);
        } catch(err) {
          logTo('repl','console-error',`<span>> ${code}</span><pre>${err}</pre>`);
        }
        e.target.value = '';
      }
    });

    // IndexedDB UI
    window.consoleDumpStore = (dbName, storeName) =>
      loadIndexedDBStore(dbName, storeName, data =>
        logTo('storage','console-log', sortAndRenderStoreData(data,`Contents of ${storeName}`))
      );
    document.getElementById('idb-add').addEventListener('click', addIndexedDBKey);
    document.getElementById('idb-del').addEventListener('click', deleteIndexedDBKey);
    document.getElementById('idb-filter').addEventListener('input', filterIDBResults);
  }

  // Helper to load and display IndexedDB DBs/stores
  async function loadIndexedDBExplorer() {
    const dbSelect = document.createElement('select');
    const storeSelect = document.createElement('select');
    const resultBox = document.getElementById('idb-results');
    panels.storage.querySelectorAll('select, pre').forEach(el=>el.remove());
    panels.storage.prepend(resultBox, storeSelect, dbSelect);

    const dbs = (indexedDB.databases?.()) ?? [];
    dbs.forEach(db => {
      const opt = document.createElement('option');
      opt.value = db.name;
      opt.textContent = db.name || '(unnamed)';
      dbSelect.appendChild(opt);
    });
    dbSelect.addEventListener('change', () => {
      storeSelect.innerHTML = '';
      const req = indexedDB.open(dbSelect.value);
      req.onsuccess = () => {
        [...req.result.objectStoreNames].forEach(name => {
          const o = document.createElement('option');
          o.value = name;
          o.textContent = name;
          storeSelect.appendChild(o);
        });
        storeSelect.addEventListener('change', () => loadIndexedDBStore(dbSelect.value, storeSelect.value, data =>
          resultBox.innerHTML = sortAndRenderStoreData(data,`Contents of ${storeSelect.value}`,resultBox)
        ));
      };
    });
  }

  function loadIndexedDBStore(dbName, storeName, callback) {
    const req = indexedDB.open(dbName);
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction(storeName,'readonly');
      const store = tx.objectStore(storeName);
      const all = store.getAll();
      all.onsuccess = () => callback(all.result);
      tx.oncomplete = () => db.close();
    };
  }

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
  try {
    const parsed = JSON.parse(value);
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
        storeSelect.dispatchEvent(new Event('change')); // reload view
      };
    };
  } catch (e) {
    alert('❌ Invalid JSON');
  }
});


  document.getElementById('idb-del').addEventListener('click', () => {
  const dbName = dbSelect.value;
  const storeName = storeSelect.value;
  const key = prompt('Enter key to delete:');
  if (!key) return;
  const req = indexedDB.open(dbName);
  req.onsuccess = () => {
    const db = req.result;
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(key);
    tx.oncomplete = () => {
      db.close();
      storeSelect.dispatchEvent(new Event('change')); // reload
    };
  };
});

  all.onsuccess = () => {
  const data = all.result.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  resultBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
};

  console.log('✅ Mobile Console Loaded');
})();
