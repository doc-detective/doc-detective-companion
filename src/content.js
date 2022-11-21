import { finder } from "@medv/finder";

document.addEventListener("click", (event) => {
  let dialog = document.getElementById("doc-detective");
  if (dialog) {
    const selector = finder(event.target);
    // Loop to identify if selector is part of main page
    let inDialog = false;
    let elements = [];
    elements[0] = document.querySelector(selector);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let parent = element.parentElement;
      let parentName = parent.nodeName.toLowerCase();
      if (parentName !== "body") {
        elements.push(parent);
        continue;
      }
      if (
        parentName === "body" &&
        element.nodeName.toLowerCase() === "div" &&
        element.id === "doc-detective"
      ) {
        inDialog = true;
      }
    }
    // Exit early if click is in the dialog
    if (inDialog) return;
    let selectorDisplay = document.getElementById("selectorDisplay");
    event.stopPropagation();
    event.preventDefault();
    selectorDisplay.innerHTML = selector;
  }
});

function copySelector() {
  // Get the text field
  var copyText = document.getElementById("selectorDisplay");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}
