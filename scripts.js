const container = document.getElementById('container');
const input = document.getElementById('input');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
let score = 0;
let isPaused = false;
let intervalId;
let wordSpeed = 1500; // Initial word speed
let words = [];

// Fetch random words from the API
fetch('https://random-word-api.herokuapp.com/word?number=20')
    .then(response => response.json())
    .then(data => {
        words = data;
    })
    .catch(error => console.error('Error fetching words:', error));

function createWord() {
    const word = document.createElement('div');
    word.classList.add('word');
    word.innerText = words[Math.floor(Math.random() * words.length)];
    word.style.left = Math.random() * (container.offsetWidth - 100) + 'px';
    container.appendChild(word);

    const fall = setInterval(() => {
        if (!isPaused) {
            const topPos = word.offsetTop;
            word.style.top = topPos + 2 + 'px';
            if (topPos > container.offsetHeight) {
                clearInterval(fall);
                container.removeChild(word);
            }
        }
    }, 50);

    return word;
}

function smashWord(word) {
    word.parentNode.removeChild(word);
    score++;
    scoreDisplay.textContent = score;

    // Increase speed every 10 points
    if (score % 10 === 0) {
        wordSpeed -= 100;
        clearInterval(intervalId);
        intervalId = setInterval(createWord, wordSpeed);
    }
}

input.addEventListener('input', (e) => {
    const typedWord = e.target.value.toLowerCase();
    const wordElements = document.querySelectorAll('.word');
    wordElements.forEach((wordElement) => {
        const currentWord = wordElement.innerText.toLowerCase();
        if (currentWord === typedWord) {
            smashWord(wordElement);
            e.target.value = ''; // Clear input after smashing word
        }
    });
});

pauseButton.addEventListener('click', () => {
    if (!isPaused) {
        clearInterval(intervalId);
        isPaused = true;
        pauseButton.textContent = 'Resume';
    } else {
        intervalId = setInterval(createWord, wordSpeed);
        isPaused = false;
        pauseButton.textContent = 'Pause';
    }
});

restartButton.addEventListener('click', () => {
    clearInterval(intervalId);
    isPaused = false;
    pauseButton.textContent = 'Pause';
    score = 0;
    scoreDisplay.textContent = score;
    container.innerHTML = '';
    wordSpeed = 1500;
    intervalId = setInterval(createWord, wordSpeed);
});

intervalId = setInterval(createWord, wordSpeed);