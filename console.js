(function () {
  const currentScript = document.currentScript || [...document.scripts].pop();
  const baseUrl = currentScript.src.split('/').slice(0, -1).join('/');

  // Load CSS (fallback)
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `${baseUrl}/console.css`;
  css.onerror = () => {
    const style = document.createElement('style');
    style.textContent = `#console-toggle{position:fixed;top:10px;right:10px;background:black;color:white;padding:10px;z-index:9999;}`;
    document.head.appendChild(style);
  };
  document.head.appendChild(css);

  // Panels object defined outside
  let panels = {};

  // Bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupConsole);
  } else {
    setupConsole();
  }

  function setupConsole() {
    // Prevent duplicates
    if (document.getElementById('mobile-console')) return;

    // Insert HTML
    document.body.insertAdjacentHTML('beforeend', `
      <div id="console-toggle">☰</div>
      <div id="mobile-console" style="display: none; flex-direction: column;">
        <div id="console-tabs">
          <button data-tab="console" class="active">Console</button>
          <button data-tab="network">Network</button>
          <button data-tab="storage">Storage</button>
          <button data-tab="info">System</button>
          <button data-tab="dom">DOM</button>
          <button data-tab="repl">REPL</button>
          <button id="toggle-theme">🌙</button>
        </div>
        <div class="console-panel" data-panel="console"></div>
        <div class="console-panel hidden" data-panel="network"></div>
        <div class="console-panel hidden" data-panel="storage">
          <div>
            <input id="idb-filter" placeholder="🔍 filter…" />
            <button id="idb-add">Add</button>
            <button id="idb-del">Delete</button>
            <div id="idb-results"></div>
          </div>
        </div>
        <div class="console-panel hidden" data-panel="info"></div>
        <div class="console-panel hidden" data-panel="dom"></div>
        <div class="console-panel hidden" data-panel="repl">
          <div id="repl-output"></div>
          <input id="repl-input" placeholder="> Type JS and press Enter"/>
        </div>
      </div>
    `);

    // Map panels AFTER DOM created
    panels = {};
    document.querySelectorAll('[data-panel]').forEach(el => {
      const name = el.dataset.panel;
      panels[name] = el;
    });

    // Setup tabs
    const tabs = document.querySelectorAll('#console-tabs button[data-tab]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');
        Object.values(panels).forEach(p => p.classList.add('hidden'));
        panels[tab.dataset.tab].classList.remove('hidden');
      });
    });

    // Toggle console
    document.getElementById('console-toggle').addEventListener('click', () => {
      const panel = document.getElementById('mobile-console');
      panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    });

    // Theme toggle
    document.getElementById('toggle-theme').addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
    });

    // IndexedDB demo (fixes `all` error)
    document.getElementById('idb-add').addEventListener('click', () => {
      const dbName = prompt('DB name?');
      const storeName = prompt('Store name?');
      const value = prompt('JSON value?');

      try {
        const parsed = JSON.parse(value);
        const req = indexedDB.open(dbName);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          store.add(parsed);
          tx.oncomplete = () => db.close();
        };
      } catch (e) {
        alert('❌ Invalid JSON');
      }
    });

    document.getElementById('idb-del').addEventListener('click', () => {
      const dbName = prompt('DB name?');
      const storeName = prompt('Store name?');
      const key = prompt('Key to delete?');
      const req = indexedDB.open(dbName);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(key);
        tx.oncomplete = () => db.close();
      };
    });

    // ✅ FIX for undefined `all`
    window.consoleDumpStore = function (dbName, storeName) {
      const req = indexedDB.open(dbName);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const all = store.getAll(); // 💡 now declared before used!
        all.onsuccess = () => {
          const json = JSON.stringify(all.result, null, 2);
          logTo('storage', 'console-log', `<strong>${storeName}:</strong><pre>${json}</pre>`);
        };
        tx.oncomplete = () => db.close();
      };
    };
  }

  // Simple logTo
  function logTo(panel, type, content) {
    const el = document.createElement('div');
    el.className = type;
    el.innerHTML = content;
    if (panels[panel]) {
      panels[panel].appendChild(el);
      panels[panel].scrollTop = panels[panel].scrollHeight;
    } else {
      console.warn(`Panel ${panel} not found`);
    }
  }
})();
