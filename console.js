(function () {
  let panels;  // 1️⃣ Declare early

  function setupConsole() {
    if (document.getElementById('mobile-console')) return;

    document.body.insertAdjacentHTML('beforeend', `
      <div id="console-toggle">☰</div>
      <div id="mobile-console" style="display:none;position:fixed;bottom:0;height:40%;width:100%;background:#222;color:white;flex-direction:column;z-index:9999;">
        <div id="console-tabs">
          <button data-tab="console" class="active">Console</button>
          <button data-tab="storage">Storage</button>
        </div>
        <div class="console-panel" data-panel="console">✨ Console ready</div>
        <div class="console-panel hidden" data-panel="storage">📦 Storage tab</div>
      </div>
    `);

    // 2️⃣ Map panels here
    panels = {};
    document.querySelectorAll('[data-panel]').forEach(el => {
      panels[el.dataset.panel] = el;
    });

    // 3️⃣ Set up tab switching
    document.querySelectorAll('#console-tabs button[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#console-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.values(panels).forEach(p => p.classList.add('hidden'));
        panels[btn.dataset.tab].classList.remove('hidden');
      });
    });

    // 4️⃣ Toggle console UI
    document.getElementById('console-toggle').addEventListener('click', () => {
      const con = document.getElementById('mobile-console');
      con.style.display = con.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Bootstrap (content loaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupConsole);
  } else {
    setupConsole();
  }
})();
