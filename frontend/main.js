function Language() {
    const languageChanger = document.querySelector('.languagechanger');
    languageChanger.textContent = 'English';
}

// Example functions for other onclick events
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
document.addEventListener('DOMContentLoaded', (event) => {
    const texts = [
      "Connecting you to the best legal services",
      "Find, Compare and book legal experts with ease"
    ];
    let index = 0;
    const element = document.getElementById('moto-text');
  
    setInterval(() => {
      index = (index + 1) % texts.length;
      element.textContent = texts[index];
    }, 5000); // Change text every 5 seconds
  });
  