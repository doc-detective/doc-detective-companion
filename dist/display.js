/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/display.js ***!
  \************************/
const dialogBody = `
  <div id="selector" class="code">
    <p id="selectorDisplay">
    </p>
    <button onclick='${copySelector}; copySelector();'>
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
      </svg>
    </button>
  </div>
`;
async function toggleDisplay() {
  // Identify if doc-detective dialog exists
  let dialog = document.getElementById("doc-detective");
  if (!dialog) {
    let dialog = document.createElement("div");
    dialog.id = "doc-detective";
    dialog.innerHTML = dialogBody;
    document.body.appendChild(dialog);
  } else {
    // If exists, remove it
    dialog.remove();
  }
}

function copySelector() {
  // Get the text field
  var copyText = document.getElementById("selectorDisplay");
  console.log(copyText);
  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}

toggleDisplay();

/******/ })()
;
//# sourceMappingURL=display.js.map