# 📱 Mobile Debug Console

**A mobile-first, in-page developer console** you can inject into any web app. Inspect, debug, log, and script without external tools — directly from your mobile or desktop browser.

---

## 🧰 Features

| Tab        | Description                                               |
|------------|-----------------------------------------------------------|
| 📦 Console | Logs `console.log`, `warn`, `error`, `info`               |
| 🌐 Network | Logs `fetch` and XHR requests (URL, status, body preview) |
| 🗄 Storage | View `localStorage`, `sessionStorage`, and IndexedDB      |
| 🖥 System  | Screen size, user agent, platform                         |
| 🌳 DOM     | Live, collapsible DOM tree with attribute inspection      |
| 🧪 REPL    | Run JavaScript live and view output or errors             |

---

## 🚀 Getting Started

### 1. Serve Locally

```bash
npx http-server .
# or
python -m http.server
Then open:

bash
Kopiera
Redigera
http://localhost:8080/your-page.html
2. Inject via Bookmarklet (Instant)
Use this to test on any page (even production/live sites):

javascript
Kopiera
Redigera
javascript:(()=>{let l=document.createElement('link');l.rel='stylesheet';l.href='https://benneberg.github.io/mobile-console/console.css?t='+Date.now();document.head.appendChild(l);let s=document.createElement('script');s.src='https://benneberg.github.io/mobile-console/console.js?t='+Date.now();s.defer=true;document.head.appendChild(s);console.log('🧪 Injecting debug console…');})();
Name: 📱 Mobile Console

Paste into bookmark URL

Click on any webpage to load the console

✅ Current Features (Implemented)
✅ Console tab override (console.log, warn, error, info)

✅ Network tab with fetch/XHR logging and response bodies

✅ Storage tab with full localStorage, sessionStorage, and IndexedDB UI

✅ System info: screen size, user agent, platform

✅ DOM tree viewer with collapsible nodes (<details>/<summary>)

✅ REPL for inline JavaScript evaluation

✅ Global error & promise rejection capture

✅ Element picker with live highlight

✅ Basic performance watcher (slow frames)

🔧 Planned Features (Ideas & In Progress)
🔸 1. IndexedDB CRUD + Filtering
Status: ⚙️ In progress
Features:

View & select DB and store

Filter, add, delete, sort items

Editable JSON

🔸 2. DOM Inspector (Nested & Expandable)
Status: ✅ Basic implemented
Plans:

Show attributes

Live hover highlight

Click to inspect/edit

🔸 3. JS Error Catcher
Status: ✅ Done

Captures uncaught exceptions and logs them

🔸 4. ConsoleDump Snapshot Tool
Capture current app state:

Download all console/storage/network/system data as JSON

Optional webhook for remote diagnostics

🔸 5. Live Element Picker
Tap to inspect and log node info

Hover to highlight

Inject test styles

🔸 6. JS Performance Watcher
Measure slow frames

Track expensive operations

Show FPS or layout thrashing alerts

🔸 7. Request/Response Bodies (Enhanced)
Full preview of fetch and XHR bodies

Toggleable collapsed responses

🔸 8. Custom Logs / Bookmarks
Let user tag actions:

js
Kopiera
Redigera
console.log("🚩 Step 2: Login clicked");
🔸 9. Keyboard Shortcuts / Gestures
Swipe to open console

Volume keys for toggle (PWA trick)

🔸 10. Theme Toggle
Dark/light theme

Save in localStorage

📌 Usage Tips
Use REPL tab to run:

js
Kopiera
Redigera
consoleDumpStore('myDatabase', 'myStore');
Use Storage tab to:

Pick DB + object store

Auto-render values as JSON

Edit, add, or delete records (planned)

Tool survives reloads via bookmarklet. Consider a Chrome extension for persistent auto-injection.

🌐 Hosting Options
GitHub Pages (like https://benneberg.github.io/mobile-console/)

Netlify / Vercel / Cloudflare Pages

jsDelivr / CDN

Update the bookmarklet URL accordingly.

🔚 Summary
Method	Best For	Setup Effort	Notes
✅ Bookmarklet	Testing any site on the fly	⭐ Easy	Paste once, test anywhere
🧩 Extension	Auto-load on selected domains	🔧 Medium	Optional next step
🌍 CDN Loader	Sharing/debugging on mobile	⭐⭐ Easy	Just send a URL

Made with ❤️ by @benneberg
