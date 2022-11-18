/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['dialog.js']
  });
})
/******/ })()
;
//# sourceMappingURL=background.js.map