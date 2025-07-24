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
