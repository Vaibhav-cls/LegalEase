const body = document.body;
body.classList.add("no-scroll");
function hideLoader() {
  loader.classList.add("hidden");
  content.style.display = "block";
}
const timeout = setTimeout(() => {
  hideLoader();
}, 5000);
document.addEventListener("DOMContentLoaded", function () {
  // Hide loader and show content
  const loader = document.getElementById("loader");
  clearTimeout(timeout);
  body.classList.remove("no-scroll");
  const content = document.getElementById("main-content");
  loader.classList.add("hidden");
  content.style.display = "block";
});
