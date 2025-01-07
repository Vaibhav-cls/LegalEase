document.addEventListener("DOMContentLoaded", function () {
  const part2 = document.querySelector(".sign-up-part-2");
  const part3 = document.querySelector(".sign-up-part-3");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.querySelector(".prev");
  const clientNextBtn = part2.querySelector(".next-btn");
  part3.style.display = "none";
  nextBtn.addEventListener("click", () => {
    part2.style.display = "none";
    prevBtn.style.display = "block";
    part3.style.display = "block";
  });

  // Previous button functionality
  prevBtn.addEventListener("click", () => {
    part3.style.display = "none";
    part2.style.display = "block";
    prevBtn.style.display = "none";
  });

  //Tags section
  let addBtn = document.getElementById("add");
  let nameInput = document.getElementById("name");
  let addedTags = document.getElementById("added-tags");
  let existingTags = document.getElementById("existing-tags");
  let selectedTagsInput = document.getElementById("selectedTags");
  let selectedTags = [];
  let tagArray = [];

  // Populate tagArray with all tags
  for (tag of allTags) {
    tagArray.push(tag.name);
  }

  // Create tag elements in the existing tags section
  for (let i = 0; i < tagArray.length; i++) {
    let newElement = document.createElement("div");
    newElement.innerText = tagArray[i] + " +";
    newElement.value = tagArray[i];
    newElement.classList.add("tag-item");
    newElement.addEventListener("click", () => {
      if (!newElement.classList.contains("disabled")) {
        selectedTags.push(newElement.value);
        newElement.classList.add("disabled");
        updateAddedTags();
        console.log(selectedTags);
      }
    });
    existingTags.appendChild(newElement);
  }

  function updateAddedTags() {
    addedTags.innerHTML = "";

    selectedTags.forEach((tag) => {
      let newElement = document.createElement("div");
      newElement.innerText = tag + " x";
      newElement.value = tag;
      newElement.classList.add("tag-item", "addedTag");

      // Add click event to remove from selectedTags
      newElement.addEventListener("click", () => {
        selectedTags = selectedTags.filter((val) => val !== tag);
        let correspondingButton = [...existingTags.children].find(
          (btn) => btn.value === tag
        );
        if (correspondingButton) {
          correspondingButton.classList.remove("disabled");
        }
        updateAddedTags();
        console.log(selectedTags);
      });

      addedTags.appendChild(newElement);
    });
  }

  // Add new tags via the input field
  addBtn.addEventListener("click", () => {
    let newTag = nameInput.value.trim();
    if (newTag && !selectedTags.includes(newTag)) {
      selectedTags.push(newTag);
      updateAddedTags();
      nameInput.value = "";
    }
  });

  // Store selected tags before form submission
  document
    .getElementById("details-form")
    .addEventListener("submit", function (event) {
      selectedTagsInput.value = JSON.stringify(selectedTags);
    });
});
