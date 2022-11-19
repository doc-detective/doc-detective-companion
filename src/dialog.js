// Identify if doc-detective dialog exists
let dialog = document.getElementById("doc-detective");
if (!dialog) {
  // If doesn't exist, create it
  let dialog = document.createElement("div");
  dialog.id = "doc-detective";
  document.body.appendChild(dialog);
} else {
  // If exists, remove it
  dialog.remove();
}
