const toggleButton = document.getElementById("toggle-button");
const toggleDiv = document.querySelector(".toggle-label");
const selectedValue = document.getElementById("selected-value");

toggleDiv.addEventListener("click", function () {
//   toggleButton.checked = !toggleButton.checked;
  if (toggleButton.checked) {
    selectedValue.value = "provider";
  } else {
    selectedValue.value = "client";
    }
    
});