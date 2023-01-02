# Doc Detective Companion

A browser extention to find short, unique CSS selectors for use in [Doc Detective](https://github.com/hawkeyexl/doc-detective) tests.

## Install

Get the extension from your browser's applicable store, or build and install [development](#develop) versions:

*   [Chrome Webstore](https://chrome.google.com/webstore/detail/doc-detective-companion/dfpbndchffmilddiaccdcpoejljlaghm)
*   [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/doc-detective-companion)
## Future updates

*   Specify preferred IDs, classes, or attributes to use in CSS selectors.
*   Build Doc Detective test actions based on CSS selectors.
*   Build entire Doc Detective tests based on CSS selectors.

## Develop

This extension was created with [Extension CLI](https://oss.mobilefirst.me/extension-cli/).

### Available Commands

| Commands | Description |
| --- | --- |
| `npm run start` | build extension for manifest v3 browsers (Chrome), watch file changes |
| `npm run start:v2` | build extension for manifest v2 browsers (Firefox), watch file changes |
| `npm run build` | generate release version for manifest v3 browsers (Chrome) |
| `npm run build:v2` | generate release version for manifest v2 browsers (Firefox) |

For CLI instructions see [User Guide &rarr;](https://oss.mobilefirst.me/extension-cli/)

### Learn More

**Extension Developer guides**

- [Getting started with extension development](https://developer.chrome.com/extensions/getstarted)
- Manifest configuration: [version 2](https://developer.chrome.com/extensions/manifest) - [version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Permissions reference](https://developer.chrome.com/extensions/declare_permissions)
- [Chrome API reference](https://developer.chrome.com/docs/extensions/reference/)

**Extension Publishing Guides**

- [Publishing for Chrome](https://developer.chrome.com/webstore/publish)
- [Publishing for Edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- [Publishing for Opera addons](https://dev.opera.com/extensions/publishing-guidelines/)
- [Publishing for Firefox](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)
