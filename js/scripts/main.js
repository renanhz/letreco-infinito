import { VALID_GUESSES } from "../constants/validGuesses.js";
import { WORDS } from "../constants/wordlist.js";
import { MAX_LETTERS, MAX_LINES } from "../constants/magicNumbers.js"

const wordContainer = document.querySelector('.word-container');

let currentLine = 0;
let currentLetter = 0;

let formedWord = '';
let chosenWord = '';

chooseRandomWord();
renderLetterBoxes();

function chooseRandomWord() {
  chosenWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  console.log(chosenWord);
}

function renderLetterBoxes() {
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
}

onkeyup = (event) => {
  const keyCode = event.code;
  const key = event.key;
  console.log(formedWord)

  if (keyCode.includes('Key')) {
    addLetter(key);
  } else if (key === 'Backspace') {
    removeLetter();
  } else if (key === 'Enter' && formedWord.length === MAX_LETTERS) {
    guessWord();
  }
}

function addLetter(key) {
  const currentLineElement = getCurrentLineElement();
  const currentLetterElement = getCurrentLetterElement(currentLineElement);
  
  if (!currentLetterElement.innerHTML) {
    currentLetterElement.innerHTML = `<span>${key.toUpperCase()}</span>`;
    formedWord+=key;
  }

  if (currentLetter < 4) {
    currentLetter ++;
  }
}

function getCurrentLineElement() {
  return wordContainer.children.item(currentLine);
}

function getCurrentLetterElement(currentLineElement) {
  return currentLineElement.children.item(currentLetter);
}


function removeLetter() {
  const currentLineElement = getCurrentLineElement();
  let currentLetterElement = getCurrentLetterElement(currentLineElement);

  if (!currentLetterElement.innerHTML && currentLetter > 0) {
    currentLetter--;
    currentLetterElement = getCurrentLetterElement(currentLineElement);
  }

  if (currentLetterElement.innerHTML) {
    currentLetterElement.firstChild.remove();
    formedWord = formedWord.slice(0, currentLetter);
  }
}

function guessWord() {
  const currentLineElement = getCurrentLineElement();
  const children = currentLineElement.children;

  const chosenWordNormalized = removeAccentsFromWord(chosenWord);
  const formedWordLowerCase = formedWord.toLowerCase();

  console.log(formedWordLowerCase);

  if (formedWordLowerCase === chosenWordNormalized) {
    applyRightLetterClass(children);
    // chamar api do dicionario, 
    // mostrando significado da palavra e frases prontas a utilizando

    // mostrar botão play again // reseta tudo
  } else {
    //verificar letra por letra da formedWord com a chosenWord

    for(let i = 0; i < formedWordLowerCase.length; i++) {
      const formedWordLetter = formedWordLowerCase.charAt(i);
      const chosenWordLetter = chosenWordNormalized.charAt(i);
      const currentLetterBox = children.item(i);

      if (formedWordLetter === chosenWordLetter) {
        applyClassToElement(currentLetterBox, 'right-letter');
      } else if (chosenWordNormalized.includes(formedWordLetter)) {
        applyClassToElement(currentLetterBox, 'displaced-letter');
      } else {
        applyClassToElement(currentLetterBox, 'wrong-letter');
      }

    }

    goToNextLine();
  }
  
}

function removeAccentsFromWord(word) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function applyRightLetterClass(children) {
  Array.from(children).forEach(letterBox => {
    applyClassToElement(letterBox, 'right-letter');
  });
}

function applyClassToElement(el, className) {
  el.classList.add(className);
}

function goToNextLine() {
  if(currentLine < MAX_LINES) {
    currentLine++;
    currentLetter = 0;
    formedWord = '';
  } else {
    //game over
  }
}

