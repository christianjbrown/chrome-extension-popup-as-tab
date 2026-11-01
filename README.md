# Popup As Tab Chrome Extension 🪄

You know those little chromeless windows that sign-in flows, payment pages and web apps love to throw at you? This Chrome extension catches them and turns each one into a plain old tab, right next to the tab that opened it. No options page, no settings, no button. It's just always on.

## What you get 🗂️

- **Popups become tabs.** Anything a page opens with `window.open` and popup sizes ends up as an ordinary tab instead, and the popup window is gone.
- **Right where you'd look.** The new tab slots in straight after the tab that opened it, in the same window, and gets focus.
- **Sign-ins keep working.** The page that opened it still talks to it, so "Sign in with..." flows finish and close themselves like before. 🔑
- **Minimised opener? No problem.** If the window the popup came from is minimised, the tab goes to the end of the ordinary window you used last, so it doesn't vanish into the dock.
- **Incognito stays incognito.** A popup from an incognito tab only ever lands in an incognito window, and the other way round. Chrome won't mix them anyway.

## What it leaves alone 🙅

- **New windows you open yourself.** Cmd+N (Ctrl+N), "Open link in new window", dragging a tab out: all untouched.
- **Popups other extensions make,** like a password manager's pop-out. Chrome marks which popups a web page opened, and only those get turned into tabs.
- **App windows and DevTools,** and any popup opened from one of them.

## Install it 🔧

You need [Node.js](https://nodejs.org) 22 or newer, and Chrome 126 or newer.

1. Grab the code and build it:

   ```bash
   git clone https://github.com/christianjbrown/chrome-extension-popup-as-tab.git
   cd chrome-extension-popup-as-tab
   npm ci
   npm run build
   ```

   That makes a `dist` folder, which is the actual extension.

2. Open `chrome://extensions` in Chrome.
3. Flip on **Developer mode** (top right).
4. Click **Load unpacked** and pick the `dist` folder.

That's it. There's nothing to pin, because there's nothing to click. Go open a popup and watch it turn into a tab. ✨

### Updating 🔄

```bash
git pull
npm ci
npm run build
```

Then hit the reload arrow on the Christian's Popup As Tab card in `chrome://extensions`.

## Good to know 🤓

- **You'll see the popup for a split second** before it becomes a tab. Chrome opens the window first and only then tells extensions about it.
- **Incognito popups** only get caught if you've turned on **Allow in Incognito** for the extension in `chrome://extensions`.
- **It asks for no permissions at all.** Moving a tab and knowing which tab opened it don't need any. It never reads your pages, URLs or tab titles.

## No tracking 🔒

No analytics, no tracking, no ads, no accounts, and nothing phoning home. It never talks to the internet at all, so nothing about your windows or tabs leaves your machine.

## Development 🛠️

It's TypeScript, bundled with esbuild, tested with Vitest.

```bash
npm test          # the unit tests
npm run ci        # everything CI checks: format, lint, types, unused code, 100% coverage, build
```

`npm run ci` is exactly what CI runs, and coverage has to stay at 100% for lines, branches, functions and statements, or it fails. To run it before every push, point git at the committed hook: `git config core.hooksPath .githooks`.

How it fits together, all in `src`:

- **`main.ts`** wires the pieces to Chrome and listens for new popup windows. Nothing else touches `chrome` directly.
- **`popup-converter.ts`** decides whether a popup is a page's popup, and if so where it goes, then moves it.
- **`opener-finder.ts`** looks up the tab that opened the popup, and its window, if they're still around.
- **`destination.ts`** asks a list of rules for a destination and takes the first answer.
- **`beside-opener.ts`** is the first rule: right after the opener, if its window is on screen.
- **`last-focused-window.ts`** is the fallback: the end of the ordinary window you used most recently.
- **`tab-placer.ts`** moves the tab, makes it active and focuses its window.

Every class gets its collaborators through its constructor, behind an interface, so each one is tested on its own with fakes. A new way of picking where a tab goes is a new rule class, not an edit to an old one.

## Licence 📄

MIT. See [LICENSE](LICENSE).
