import { finder } from "@medv/finder";

document.addEventListener("click", (event) => {
  let dialog = document.getElementById("doc-detective");
  if (dialog) {
    let selectorDisplay = document.getElementById("selectorDisplay");
    event.stopPropagation();
    event.preventDefault();
    const selector = finder(event.target);
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
