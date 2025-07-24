# 📱 Mobile Debug Console

**A mobile-first, in-page developer console** you can inject into any web app. Inspect, debug, log, and script without any external tools — directly from your mobile or desktop browser.

---

## 🧰 Features

| Tab      | Description                                      |
|----------|--------------------------------------------------|
| 📦 Console  | Logs `console.log`, `warn`, `error`, `info`      |
| 🌐 Network  | Monitors API calls via `fetch` and XHR           |
| 🗄 Storage  | View `localStorage`, `sessionStorage`, and IndexedDB |
| 🖥 System   | Screen size, user agent, platform info           |
| 🌳 DOM      | Lightweight view of current DOM tree             |
| 🧪 REPL     | Live JavaScript execution with output/errors      |

---

## 💡 Planned Improvements

- 🔁 Manual refresh buttons for Storage/DOM tabs
- 🔍 Filter logs by type or keyword search
- 🧵 Expandable/collapsible DOM tree nodes
- 📦 Show request bodies and response content
- ↕️ Resizable console height with draggable edge

---

## 🚀 Getting Started

### 1. Serve Locally

Make sure `console.js` is served from a reachable local or remote path.

```bash
npx http-server .
# or
python -m http.server
```

Then visit your test page with debug mode enabled:

```
http://localhost:8080/your-page.html?debug=true
```

---

## 🔧 Integration Options

### ✅ 1. Inject via Bookmarklet (Instant)

Add the console to any page, including third-party sites, using a bookmarklet.

**What It Does:**  
Injects your hosted `console.js` and auto-initializes the mobile console.  
Works in Chrome, Firefox, Safari, Edge, etc.

#### 🛠 Setup Steps

1. Host your `console.js` and `console.css` (locally or on a CDN)
2. Create this bookmarklet:

```javascript
javascript:(()=>{let s=document.createElement('script');s.src='http://172.21.48.1:8080/console.js';s.defer=true;document.head.appendChild(s);console.log('🧪 Injecting debug console…');})();
```

3. Add it as a new browser bookmark:
   - **Name:** 📱 Mobile Console
   - **URL:** Paste the full code above

4. Click it on any web page — boom 💥 your console appears!

---

### 🧩 2. Chrome Extension (Optional Upgrade)

**Pros:**
- Auto-injects on every page or specific domains
- Works hands-free — no need to click a bookmark
- Enables UI enhancements (buttons, shortcuts, themes)

---

### 🌍 3. CDN-Based Universal Loader

To make the tool work universally (on mobile + third-party pages):

**Host files on fex:**
- GitHub Pages
- Netlify
- Cloudflare Pages
- jsDelivr or other CDN
###Then update the bookmarklet URL to:
- https://yourdomain.com/mobile-console/console.js

Then use this enhanced bookmarklet to load both JS & CSS:

```javascript
javascript:(()=>{let l=document.createElement('link');l.rel='stylesheet';l.href='http://172.21.48.1:8080/console.css';document.head.appendChild(l);let s=document.createElement('script');s.src='http://172.21.48.1:8080/console.js';s.defer=true;document.head.appendChild(s);console.log('🧪 Injecting debug console…');})();
```

---

## ✅ Summary

| Method        | Use Case                      | Setup Effort | Notes                        |
|---------------|------------------------------|--------------|------------------------------|
| ✅ Bookmarklet | Quick injection into any web page | ⭐ Easy       | Great for fast testing       |
| 🧩 Extension   | Auto-run on target sites      | 🔧 Medium     | Full devtool companion       |
| 🌍 CDN Loader  | Universal, mobile-friendly use | ⭐⭐ Easy      | Works even on 3rd-party pages|

---

## 📌 Tip

This tool is ideal for:
- Debugging on real mobile devices
- QA teams without desktop dev tools
- Debugging production without modifying source

In the REPL tab you can use:
consoleDumpStore('myDatabase', 'myStore'); 

In Storage tab you can:
Pick a database from dropdown
Pick an object store
See JSON results directly below

---


 Implemented
 Console tab override (console.log, warn, etc.)

 Network tab (fetch/XHR logging)

 Storage tab (localStorage, sessionStorage, IndexedDB)

 System tab (screen, UA, platform)

 DOM tab (basic tree view)

 REPL tab (interactive JS eval)

🔧 Planned & Useful Features (To Be Added)
🔸 1. IndexedDB CRUD + Filtering UI
Status: ⚙️ In progress

Filter, add, delete, and sort store contents

UI: dropdowns + editable JSON

Bonus: highlight changed keys live via polling or events

🔸 2. DOM Inspector (Nested & Expandable)
Status: ❓Idea

Like Chrome DevTools: collapsible tree with arrows

Show attributes & event listeners

Live-highlight on hover over tree

Could use <details>/<summary> tags for native collapsible tree

🔸 3. Event Logger
Track and log user interactions:

Clicks, input changes, form submissions

Logs to "Events" tab with timestamps

Optional: Filter by tag, class, or event type

js
Kopiera
Redigera
document.addEventListener('click', e => {
  logTo('events', 'console-log', `🖱️ Clicked: <${e.target.tagName}>`);
});
🔸 4. ConsoleDump Snapshot Tool
Capture app state for debug:

Dump all storage, cookies, user agent, system info into a big JSON blob

Download as .json via Blob + a.download click

Optional: auto-send to webhook for diagnostics

🔸 5. Live Element Picker / Highlighter
Chrome-like hover & highlight:

On touch/hover, outline the DOM element

Tap to log node info or inject custom styles

Useful for debugging layout & styling

🔸 6. JS Performance Watcher
Measure:

Time between events

Track function timing (e.g., via performance.mark)

Show slow calls or layout thrashing

🔸 7. Custom Logs/Bookmarks
Let user tag parts of the session:

“Add Marker” button logs a timestamp and note

Useful for test session bookmarks like:

sql
Kopiera
Redigera
🚩 Step 3: User logs in
🔸 8. Dark/Light Theme Toggle
Status: 🎨 Cosmetic

Let dev toggle dark/light theme

Save preference in localStorage

🔸 9. Clipboard Utility Tab
Read/write from clipboard

Copy values from other tabs

Paste JSON and store it

🔸 10. Network Inspector: Request/Response Bodies
Right now you only log fetch/XHR summary. You could:

Read response .text() or .json() (clone first)

Show in collapsible sections in the network tab

🔸 11. JS Error Catcher
Global window.onerror and window.onunhandledrejection

Logs stack traces to Console tab

Group similar errors (optional)

🔸 12. Mobile-Friendly Keyboard Shortcuts
Swipe gestures or long-press toggles?

Volume button console open/close (PWA hack)

🔸 13. FPS or Animation Monitor
Small FPS overlay for perf debugging

Optionally attach requestAnimationFrame watcher
