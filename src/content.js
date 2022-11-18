import { finder } from "@medv/finder";

document.addEventListener("click", (event) => {
  let dialogCheck = document.getElementById("doc-detective");
  if (dialogCheck) {
    event.stopPropagation();
    event.preventDefault();
    const selector = finder(event.target);
    console.log(selector);
  }
});
