import { VALID_GUESSES } from "../constants/validGuesses.js";
import { WORDS } from "../constants/wordlist.js";
import { MAX_LETTERS, MAX_LINES } from "../constants/magicNumbers.js"

const wordContainer = document.querySelector('.word-container');

let currentLine = 0;
let currentLetter = 0;

let formedWord = '';

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
  console.log(event);
  const keyCode = event.code;

  if (keyCode.includes('Key')) {
    const key = event.key;

    addToLine(key);
  }
}

function addToLine(key) {
  const currentLineElement = wordContainer.children.item(currentLine);

  const currentLetterElement = currentLineElement.children.item(currentLetter);

  if (currentLetter < 5) {
    currentLetterElement.innerHTML = `<span>${key.toUpperCase()}</span>`;

    formedWord += key;
    currentLetter++;
  }
  console.log(formedWord)
}


