import { VALID_GUESSES } from "../constants/validGuesses.js";
import { WORDS } from "../constants/wordlist.js";
import { MAX_LETTERS, MAX_LINES } from "../constants/magicNumbers.js"

const wordContainer = document.querySelector('.word-container');

let currentLine = 0;
let currentLetter = 0;

let formedWord = '';

chooseRandomWord();

for (let i = 1; i <= MAX_LINES; i++ ) {
  const line = document.createElement('div');
  line.className = 'word-line';

  for (let j = 0; j < MAX_LETTERS; j++) {
    const letter = document.createElement('div');
    letter.className = 'word-letter';

    line.appendChild(letter);
  }

  wordContainer.appendChild(line);
}

onkeyup = (event) => {
  const keyCode = event.code;
  const key = event.key;

  if (keyCode.includes('Key')) {
    addLetter(key);
  } else if (key === 'Backspace') {
    removeLetter();
  } else if (key === 'Enter') {
    guessWord();
  }
}

function addLetter(key) {
  const currentLineElement = wordContainer.children.item(currentLine);
  const currentLetterElement = currentLineElement.children.item(currentLetter);
  
  if (!currentLetterElement.innerHTML) {
    currentLetterElement.innerHTML = `<span>${key.toUpperCase()}</span>`;
  }

  if (currentLetter < 4) {
    currentLetter ++;
  }
}


function removeLetter() {
  const currentLineElement = wordContainer.children.item(currentLine);
  let currentLetterElement = currentLineElement.children.item(currentLetter);

  if (!currentLetterElement.innerHTML) {
    if (currentLetter >0) {
      currentLetter--;
    }
    currentLetterElement = currentLineElement.children.item(currentLetter);
  }

  currentLetterElement.firstChild.remove();
}

function guessWord() {

}

function chooseRandomWord() {
  const chosenWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  localStorage.setItem('chosenWord', chosenWord);
}
