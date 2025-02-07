function Language() {
  const languageChanger = document.querySelector(".languagechanger");
  languageChanger.textContent = "English";
}

function Decrease() {
  console.log("Decrease text size");
}

function Reset() {
  console.log("Reset text size");
}

function Increase() {
  console.log("Increase text size");
}

function LightMode() {
  console.log("Switch to light mode");
}

function DarkMode() {
  console.log("Switch to dark mode");
}

/*-----------------service provider About section----------*/
try {
  // Event listener for about section
  document.getElementById("aboutBtn").addEventListener("click", function () {
    try {
      document.getElementById("aboutSection").classList.remove("hidden");
      document.getElementById("settingSection").classList.add("hidden");
      this.classList.add("active");
      document.getElementById("settingBtn").classList.remove("active");
    } catch (error) {
      console.error("Error handling about button click: ", error);
    }
  });

  // Event listener for setting section
  document.getElementById("settingBtn").addEventListener("click", function () {
    try {
      document.getElementById("settingSection").classList.remove("hidden");
      document.getElementById("aboutSection").classList.add("hidden");
      this.classList.add("active");
      document.getElementById("aboutBtn").classList.remove("active");
    } catch (error) {
      console.error("Error handling setting button click: ", error);
    }
  });
} catch (error) {
  console.error("Error initializing event listeners: ", error);
}

/*----------- Post area content of javascrit ------*/

document.getElementById("postsBtn").addEventListener("click", function () {
  document.getElementById("postsSection").classList.remove("hidden1");
  document.getElementById("reviewsSection").classList.add("hidden1");
  document.getElementById("appointmentSection").classList.add("hidden1");

  this.classList.add("active");
  document.getElementById("reviewsBtn").classList.remove("active");
  document.getElementById("appointmentBtn").classList.remove("active");
});

document.getElementById("reviewsBtn").addEventListener("click", function () {
  document.getElementById("reviewsSection").classList.remove("hidden1");
  document.getElementById("postsSection").classList.add("hidden1");
  document.getElementById("appointmentSection").classList.add("hidden1");

  this.classList.add("active");
  document.getElementById("postsBtn").classList.remove("active");
  document.getElementById("appointmentBtn").classList.remove("active");
});

document
  .getElementById("appointmentBtn")
  .addEventListener("click", function () {
    document.getElementById("appointmentSection").classList.remove("hidden1");
    document.getElementById("postsSection").classList.add("hidden1");
    document.getElementById("reviewsSection").classList.add("hidden1");

    this.classList.add("active");
    document.getElementById("postsBtn").classList.remove("active");
    document.getElementById("reviewsBtn").classList.remove("active");
  });

document.getElementById("postBtn").addEventListener("click", function () {
  const postInput = document.getElementById("postInput").value;
  if (postInput.trim() !== "") {
    const postContent = document.getElementById("postContent");
    const postItem = document.createElement("div");
    postItem.classList.add("content-item");

    postItem.innerHTML = `
        <div class="avatar"></div>
        <div class="content-text">
          <p class="username">User@123</p>
          <p>${postInput}</p>
        </div>
      `;

    postContent.appendChild(postItem);
    document.getElementById("postInput").value = "";
  }
});

// document.getElementById("reviewBtn").addEventListener("click", function() {
//   const reviewInput = document.getElementById("reviewInput").value;
//   if (reviewInput.trim() !== "") {
//     const reviewContent = document.getElementById("reviewContent");
//     const reviewItem = document.createElement("div");
//     reviewItem.classList.add("review-item");

//     reviewItem.innerHTML = `
//       <div class="avatar" style="background-color: green;"></div>
//       <div class="content-text">
//         <p class="username">User@123</p>
//         <p>${reviewInput}</p>
//       </div>
//     `;

//     reviewContent.appendChild(reviewItem);
//     document.getElementById("reviewInput").value = "";
//   }
// });

document.getElementById("imageBtn").addEventListener("click", function () {
  document.getElementById("imageUpload").click();
});

document
  .getElementById("imageUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const postContent = document.getElementById("postContent");
        const postItem = document.createElement("div");
        postItem.classList.add("content-item");

        postItem.innerHTML = `
          <div class="avatar"></div>
          <div class="content-text">
            <p class="username">User@123</p>
            <img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; height: auto;">
          </div>
        `;

        postContent.appendChild(postItem);
      };
      reader.readAsDataURL(file);
    }
  });

document.getElementById("emojiBtn").addEventListener("click", function () {
  const emoji = prompt("Choose an emoji:");
  if (emoji) {
    const postContent = document.getElementById("postContent");
    const postItem = document.createElement("div");
    postItem.classList.add("content-item");

    postItem.innerHTML = `
        <div class="avatar"></div>
        <div class="content-text">
          <p class="username">User@123</p>
          <p>${emoji}</p>
        </div>
      `;

    postContent.appendChild(postItem);
  }
});

// Appointment booking form
// document.getElementById("appointmentForm").addEventListener("submit", function(event) {
//   event.preventDefault();

//   const name = document.getElementById("name").value;
//   const date = document.getElementById("date").value;
//   const time = document.getElementById("time").value;

//   const resultDiv = document.getElementById("appointmentResult");
//   resultDiv.innerHTML = `
//     <p><strong>Appointment Booked!</strong></p>
//     <p>Name: ${name}</p>
//     <p>Date: ${date}</p>
//     <p>Time: ${time}</p>
//   `;

//   document.getElementById("appointmentForm").reset();
// });

/*-------------Experties selection Script-----------*/
// Function to add skill from input to chosen tags
function addSkill() {
  const skillInput = document.getElementById("skill");
  const skillValue = skillInput.value.trim();
  if (skillValue) {
    displayTag(skillValue);
    skillInput.value = ""; // Clear input after adding
  }
}

// Function to display chosen tags in the left box
function displayTag(tagName) {
  const chosenTagsList = document.getElementById("chosen-tags-list");
  const tagElement = document.createElement("div");
  tagElement.className = "tag-item";
  tagElement.innerText = tagName;
  chosenTagsList.appendChild(tagElement);
}

// Function to select tag from available tags on the right
function selectTag(tagName) {
  displayTag(tagName);
}

const showBtn = document.getElementById("show-btn");
const password = document.querySelector("input[type='password']");
showBtn.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    showBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
  } else {
    password.type = "password";
    showBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  }
});
