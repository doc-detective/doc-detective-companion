var browser = require("webextension-polyfill");

const dialogBody = `
<div class="heading">
  <p>Doc Detective Companion</p>
  <button id="record" class="record">
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19,12C19,15.86 15.86,19 12,19C8.14,19 5,15.86 5,12C5,8.14 8.14,5 12,5C15.86,5 19,8.14 19,12Z"
      />
    </svg>
  </button>
  <button style="display:none" id="recordStop" class="record">
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9"
      />
    </svg>
  </button>
  <button class="settings">
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
      />
    </svg>
  </button>
</div>
<div id="selector" class="code container">
  <div id="selectorToggle"><p>Selector</p></div>
  <pre id="selectorDisplay" class="display" style="display:none;">
selector
  </pre>
  <button id="selectorCopy" class="copy">
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
      />
    </svg>
  </button>
</div>
<div id="action" class="code container">
  <div id="actionToggle">Action</div>
  <div id="actionSettings" class="options" style="display:none;">
    <label class="input"
      >ID<input type="text" id="actionId" name="actionId"
    /></label>
    <label class="input"
      >Description<input
        type="text"
        id="actionDescription"
        name="actionDescription"
    /></label>
    <label class="input"
      >Custom wait duration<input type="text" id="wait" name="wait"
    /></label>
    <label class="input"
      >Match text<input type="text" id="matchText" name="matchText"
    /></label>
    <label for="moveMouse"
      >Move mouse
      <select name="moveMouse" id="moveMouse">
        <option default value="exact">True</option>
        <option value="regex">False</option>
      </select></label
    >
    <label for="click"
      >Click
      <select name="click" id="click">
        <option default value="exact">True</option>
        <option value="regex">False</option>
      </select></label
    >
    <label class="input"
      >Keys to type<input type="text" id="typeKeys" name="typeKeys"
    /></label>
    <label class="input"
      >Special trailing key<input
        type="text"
        id="typeSpecial"
        name="typeSpecial"
    /></label>
  </div>
  <div id="actionOutput">
    <pre id="actionDisplay" class="display" style="display:none;">
action
  </pre
    >
    <button id="actionCopy" class="copy">
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
        />
      </svg>
    </button>
    <button id="actionAdd" class="add">
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
        />
      </svg>
    </button>
  </div>
  <div id="test" class="code container">
  <div id="testToggle">Test</div>
    <div id="testSettings" class="options" style="display:none;">
      <label class="input"
        >ID<input type="text" id="testId" name="testId"
      /></label>
      <label class="input"
        >Description<input
          type="text"
          id="testDescription"
          name="testDescription"
      /></label>
      <label for="saveFailedTestRecordings"
        >Save recordings of failed tests
        <select name="saveFailedTestRecordings" id="saveFailedTestRecordings">
          <option default value="exact">True</option>
          <option value="regex">False</option>
        </select></label
      >
      <label class="input"
        >Failed test directory<input
          type="text"
          id="failedTestDirectory"
          name="failedTestDirectory"
      /></label>
    </div>
    <div id="testOutput">
      <pre id="testDisplay" class="display" style="display:none;">
test
  </pre>
      <button id="testCopy" class="copy">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
          />
        </svg>
      </button>
    </div>
  </div>
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
    // Header listeners
    const settingsButton = document.querySelector("#doc-detective .settings");
    settingsButton.addEventListener("click", () => {
      openOptions();
    });
    // Selector listeners
    const selectorToggle = document.querySelector(
      "#doc-detective #selectorToggle"
    );
    const selectorDisplay = document.querySelector(
      "#doc-detective #selectorDisplay"
    );
    const selectorButton = document.querySelector(
      "#doc-detective #selectorCopy"
    );
    selectorToggle.addEventListener("click", () => {
      toggleElementDisplay(selectorDisplay);
    });
    selectorButton.addEventListener("click", () => {
      copySelector();
    });
    // Action listeners
    const actionToggle = document.querySelector("#doc-detective #actionToggle");
    const actionDisplay = document.querySelector(
      "#doc-detective #actionDisplay"
    );
    const actionButton = document.querySelector("#doc-detective #actionCopy");
    actionToggle.addEventListener("click", () => {
      toggleElementDisplay(actionDisplay);
    });
    actionButton.addEventListener("click", () => {
      copyAction();
    });
    // Test listeners
    const testToggle = document.querySelector("#doc-detective #testToggle");
    const testDisplay = document.querySelector("#doc-detective #testDisplay");
    const testButton = document.querySelector("#doc-detective #testCopy");
    testToggle.addEventListener("click", () => {
      toggleElementDisplay(testDisplay);
    });
    testButton.addEventListener("click", () => {
      copyTest();
    });
  } else {
    // If exists, remove it
    dialog.remove();
  }
}

function openOptions() {
  browser.runtime.sendMessage({
    action: "openOptionsPage",
  });
}

function copySelector() {
  const selectorDisplay = document.getElementById("selectorDisplay");
  copyText = selectorDisplay.innerText;
  navigator.clipboard.writeText(copyText);
  console.log("Copied the text: " + copyText);
}

function copyAction() {
  const actionDisplay = document.getElementById("actionDisplay");
  copyText = actionDisplay.innerText;
  navigator.clipboard.writeText(copyText);
  console.log("Copied the text: " + copyText);
}

function copyTest() {
  const testDisplay = document.getElementById("testDisplay");
  copyText = testDisplay.innerText;
  navigator.clipboard.writeText(copyText);
  console.log("Copied the text: " + copyText);
}

function toggleElementDisplay(element, displayType) {
  if (!displayType) displayType = "block";
  if (element.style.display === "none") {
    element.style.display = displayType;
  } else {
    element.style.display = "none";
  }
}

toggleDisplay();
