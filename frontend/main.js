function Language() {
    const languageChanger = document.querySelector('.languagechanger');
    languageChanger.textContent = 'English';
}

function Decrease() {
    console.log('Decrease text size');
}

function Reset() {
    console.log('Reset text size');
}

function Increase() {
    console.log('Increase text size');
}

function LightMode() {
    console.log('Switch to light mode');
}

function DarkMode() {
    console.log('Switch to dark mode');
}

/* ----------------text change---------*/
document.addEventListener('DOMContentLoaded', () => {
    const motoElement = document.querySelector('.moto');
    const motoTextElement = document.createElement('span');
    const cursorElement = document.createElement('span');
    cursorElement.classList.add('cursor');
    motoElement.appendChild(motoTextElement);
    motoElement.appendChild(cursorElement);

    const phrases = [
        "Connecting you to the best legal services.",
        "Find, Compare and book legal experts with ease"
    ];
    let currentPhraseIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[currentPhraseIndex];
        const displayedText = motoTextElement.textContent;
        let nextText = '';

        if (isDeleting) {
            nextText = currentPhrase.slice(0, displayedText.length - 1);
        } else {
            nextText = currentPhrase.slice(0, displayedText.length + 1);
        }

        motoTextElement.textContent = nextText;

        let typingSpeed = 100;
        if (isDeleting) {
            typingSpeed /= 2;
        }

        if (!isDeleting && nextText === currentPhrase) {
            typingSpeed = 2000; // Pause before starting to delete
            isDeleting = true;
        } else if (isDeleting && nextText === '') {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
});


/*-----------------service provider About section----------*/
document.getElementById("aboutBtn").addEventListener("click", function() {
    document.getElementById("aboutSection").classList.remove("hidden");
    document.getElementById("settingSection").classList.add("hidden");
    this.classList.add("active");
    document.getElementById("settingBtn").classList.remove("active");
  });
  
  document.getElementById("settingBtn").addEventListener("click", function() {
    document.getElementById("settingSection").classList.remove("hidden");
    document.getElementById("aboutSection").classList.add("hidden");
    this.classList.add("active");
    document.getElementById("aboutBtn").classList.remove("active");
  });

  
  /*----------- Post area content of javascrit ------*/
  
document.getElementById("postsBtn").addEventListener("click", function() {
    document.getElementById("postsSection").classList.remove("hidden1");
    document.getElementById("reviewsSection").classList.add("hidden1");
    document.getElementById("appointmentSection").classList.add("hidden1");
  
    this.classList.add("active");
    document.getElementById("reviewsBtn").classList.remove("active");
    document.getElementById("appointmentBtn").classList.remove("active");
  });
  
  document.getElementById("reviewsBtn").addEventListener("click", function() {
    document.getElementById("reviewsSection").classList.remove("hidden1");
    document.getElementById("postsSection").classList.add("hidden1");
    document.getElementById("appointmentSection").classList.add("hidden1");
  
    this.classList.add("active");
    document.getElementById("postsBtn").classList.remove("active");
    document.getElementById("appointmentBtn").classList.remove("active");
  });
  
  document.getElementById("appointmentBtn").addEventListener("click", function() {
    document.getElementById("appointmentSection").classList.remove("hidden1");
    document.getElementById("postsSection").classList.add("hidden1");
    document.getElementById("reviewsSection").classList.add("hidden1");
  
    this.classList.add("active");
    document.getElementById("postsBtn").classList.remove("active");
    document.getElementById("reviewsBtn").classList.remove("active");
  });
  
  
  document.getElementById("postBtn").addEventListener("click", function() {
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
  
  
  document.getElementById("reviewBtn").addEventListener("click", function() {
    const reviewInput = document.getElementById("reviewInput").value;
    if (reviewInput.trim() !== "") {
      const reviewContent = document.getElementById("reviewContent");
      const reviewItem = document.createElement("div");
      reviewItem.classList.add("review-item");
  
      reviewItem.innerHTML = `
        <div class="avatar" style="background-color: green;"></div>
        <div class="content-text">
          <p class="username">User@123</p>
          <p>${reviewInput}</p>
        </div>
      `;
  
      reviewContent.appendChild(reviewItem);
      document.getElementById("reviewInput").value = "";
    }
  });
  

  document.getElementById("imageBtn").addEventListener("click", function() {
    document.getElementById("imageUpload").click();
  });
  
  document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
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
  
  
  document.getElementById("emojiBtn").addEventListener("click", function() {
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
  document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
  
    const resultDiv = document.getElementById("appointmentResult");
    resultDiv.innerHTML = `
      <p><strong>Appointment Booked!</strong></p>
      <p>Name: ${name}</p>
      <p>Date: ${date}</p>
      <p>Time: ${time}</p>
    `;
  
    document.getElementById("appointmentForm").reset();
  });
  
  
