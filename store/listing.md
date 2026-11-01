# Chrome Web Store listing

Everything the developer dashboard asks for, ready to paste. The images are in this folder.

## Package

Run `npm run package` and upload the `extension.zip` it makes. Bump `version` in `static/manifest.json` before uploading an update.

## Store listing

- **Name:** Christian's Popup As Tab (read from the manifest)
- **Summary:** Popup windows open as ordinary tabs instead, right next to the tab that opened them. (read from the manifest)
- **Category:** Make Chrome Yours > Functionality & UI
- **Language:** English (United Kingdom)
- **Store icon:** `icon-128.png`
- **Screenshot:** `screenshot-1280x800.png`
- **Small promo tile:** `promo-440x280.png`
- **Homepage URL:** https://github.com/christianjbrown/chrome-extension-popup-as-tab
- **Support URL:** https://github.com/christianjbrown/chrome-extension-popup-as-tab/issues

**Description**

```text
Those small chromeless windows that sign-in flows, payment pages and web apps love to open? This turns each one into an ordinary tab, right next to the tab that opened it. There's nothing to click and nothing to set up.

• Popups a page opens with window.open become tabs, and the popup window is gone.
• The new tab goes straight after the tab that opened it, in the same window, and gets focus.
• Sign-ins keep working. The page that opened the popup can still talk to it, so "Sign in with..." flows finish and close themselves as before.
• If the window it came from is minimised, the tab goes to the ordinary window you used last.
• Incognito stays incognito.

Left alone: windows you open yourself, popups other extensions make, app windows and DevTools.

It asks for no permissions, never reads your pages, and sends nothing anywhere.
```

## Privacy practices

**Single purpose**

```text
Open popup windows that web pages create as ordinary tabs instead.
```

**Permission justifications**

The manifest asks for no permissions, so there is nothing to justify.

**Remote code:** No, I am not using remote code.

**Data usage:** tick none of the data types, then tick all three certifications.

**Privacy policy URL:** https://github.com/christianjbrown/chrome-extension-popup-as-tab/blob/main/PRIVACY.md

## Distribution

Free, public, all regions.
