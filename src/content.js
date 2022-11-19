import { finder } from "@medv/finder";

document.addEventListener("click", (event) => {
  let dialog = document.getElementById("doc-detective");
  if (dialog) {
    event.stopPropagation();
    event.preventDefault();
    const selector = finder(event.target);
    dialog.innerHTML = `<p class="code">${selector}</p>`;
  }
});
