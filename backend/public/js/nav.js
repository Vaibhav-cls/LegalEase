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