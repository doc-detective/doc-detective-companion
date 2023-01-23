# Doc Detective Companion

[![Discord Shield](https://discordapp.com/api/guilds/1066417654899937453/widget.png?style=shield)](https://discord.gg/mSCCRAhH)

A browser extension to find short, unique CSS selectors for use in [Doc Detective](https://github.com/hawkeyexl/doc-detective) tests.

## Install

Get the extension from your browser's applicable store, or build and install [development](#develop) versions:

*   Chrome/Edge: [Chrome Webstore](https://chrome.google.com/webstore/detail/doc-detective-companion/dfpbndchffmilddiaccdcpoejljlaghm)
*   Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/doc-detective-companion)
*   Safari: Unavailable on the Mac App Store. (If someone wants to sponsor yearly Apple Developer registration fees, contact me.) Build a local [development](#develop) version.

## Use

To find CSS selectors,
1.  Click the Doc Detective Companion icon in your browser. A dialog appears in your browser window.
1.  Click an element on your page. A CSS selector for the element appears in the Doc Detective Companion dialog.

    **Note**: Doc Detective Companion attempts to prevent standard browser click events (like following hyperlinks) while the dialog is active. Some websites use non-standard click event behaviors and may continue to perform tasks as they typically do.

1.  When you're done, click the Doc Detective Companion icon again. The dialog disappears, and standard click event behaviors resume.

## Future updates

*   Build Doc Detective test actions based on CSS selectors.
*   Build entire Doc Detective tests based on CSS selectors.

## Develop

This extension was created with [Extension CLI](https://oss.mobilefirst.me/extension-cli/).

### Available Commands

| Commands | Description |
| --- | --- |
| `npm run start:chrome` | Build extension for Chromium-based browsers and watch file changes. Extension files appear in `./dist`. Load as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked). |
| `npm run start:firefox` | Build extension for Firefox and watch file changes. Extension files appear in `./dist`. Load as a [temporary extension](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/), selecting the `manifest.json` file. |
| `npm run start:safari` | MacOS only. Build extension for Safari. Must run again to update for file changes. Requires Xcode. Requires Safari to [run unsigned extensions](https://developer.apple.com/documentation/safariservices/safari_web_extensions/running_your_safari_web_extension#3744467). |
| `npm run build:chrome` | Generate release version for Chromium-based browsers. |
| `npm run build:firefox` | Generate release version for Firefox. |
| `npm run publish` | Generate release versions and publish to Chrome Web Store and Firefox Addons. Requires necessary credentials in `./.env`.|
| `npm run publish:chrome` | Generate release version and publish to Chrome Web Store. Requires necessary credentials in `./.env`.|
| `npm run publish:firefox` | Generate release version and publish to Firefox Addons. Requires necessary credentials in `./.env`.|
