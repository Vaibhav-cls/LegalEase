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
document.addEventListener('DOMContentLoaded', () => {
    const motoElement = document.querySelector('.moto');
    const phrases = [
        "Connecting you to the best legal services.",
        "Find, Compare and book legal experts with ease"
    ];
    let currentPhraseIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[currentPhraseIndex];
        const displayedText = motoElement.textContent;
        let nextText = '';

        if (isDeleting) {
            nextText = currentPhrase.slice(0, displayedText.length - 1);
        } else {
            nextText = currentPhrase.slice(0, displayedText.length + 1);
        }

        motoElement.textContent = nextText;

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

  
