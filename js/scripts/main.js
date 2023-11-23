import { VALID_GUESSES } from "../constants/validGuesses.js";
import { WORDS } from "../constants/wordlist.js";
import { MAX_LETTERS, MAX_LINES, KEYS } from "../constants/consts.js";
import UIHandler from './uiHandler.js';

const wordContainer = document.querySelector('.word-container');
const keyboardContainer = document.querySelector('.keyboard-container');
const howToDialog = document.querySelector('#how-to-dialog');
const resultDialog = document.querySelector('#result-dialog');

let currentLine = 0;
let currentLetter = 0;

let formedWord = '';
let chosenWord = '';

chooseRandomWord();
renderLetterBoxes();
renderKeyboard();

function chooseRandomWord() {
  chosenWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  console.log(chosenWord);
}

function renderLetterBoxes() {
  for (let i = 0; i < MAX_LINES; i++ ) {
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

function renderKeyboard() {
  KEYS.forEach(keyLine => {
    let keys = keyLine.split('');
    renderKeyLine(keys);
  })
}

function renderKeyLine(keys) {
  const line = document.createElement('div');
  line.className = 'keyboard-line';

  keys.forEach(key => {
    const keyBox = createKeyboardButton(key);
    line.appendChild(keyBox);
  });

  keyboardContainer.appendChild(line);
}

function createKeyboardButton(key) {
  const keyBox = document.createElement('button');

  keyBox.className = 'key';
  keyBox.textContent = key;
  keyBox.dataset['key'] = key;

  keyBox.addEventListener('click', (event) => {
    addLetter(key);
  });

  return keyBox;
}


onkeyup = (event) => {
  const keyCode = event.code;
  const key = event.key;

  if (keyCode.includes('Key')) {
    addLetter(key);
  } else if (key === 'Backspace') {
    removeLetter();
  } else if (key === 'Enter') {
    onEnter();
  }
}

document.querySelector('#backspace-btn').addEventListener('click', removeLetter);
document.querySelector('#enter-btn').addEventListener('click', onEnter);
document.querySelector('#how-to-btn').addEventListener('click', () => {howToDialog.showModal();});

document.querySelectorAll('.close-btn').forEach(closeBtn => {
  closeBtn.addEventListener('click', (event) => {
    event.target.parentElement.parentElement.close();
  });
});

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
  removeInvalidWordWarning();

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

function onEnter() {
  canGuess() ? guessWord() : showInvalidWordWarning();
}

function canGuess() {
  return formedWord.length === MAX_LETTERS && VALID_GUESSES.includes(formedWord);
}

function guessWord() {
  //mudar lógica, quando colocar uma letra repetida, 
  //se já estiver acertado a posição e não tiver outra não deixar amarelo
  //se houver acertado a posição e tiver outra deixar amarelo

  const currentLineElement = getCurrentLineElement();
  const children = currentLineElement.children;

  const chosenWordNormalized = removeAccentsFromWord(chosenWord);
  const formedWordLowerCase = formedWord.toLowerCase();

  console.log(formedWordLowerCase);

  if (formedWordLowerCase === chosenWordNormalized) {
    UIHandler.addClassToChildren(children, 'right-letter');

    showResultDialog(true);
  } else {
    //verificar letra por letra da formedWord com a chosenWord

    for(let i = 0; i < formedWordLowerCase.length; i++) {
      const formedWordLetter = formedWordLowerCase.charAt(i);
      const chosenWordLetter = chosenWordNormalized.charAt(i);

      const currentLetterBox = children.item(i);
      const keyBtn = document.querySelector(`[data-key="${formedWordLetter}"]`);

      if (formedWordLetter === chosenWordLetter) {
        UIHandler.addClassToElement(currentLetterBox, 'right-letter');
        UIHandler.addClassToElement(keyBtn, 'right-letter');
      } else if (chosenWordNormalized.includes(formedWordLetter)) {
        UIHandler.addClassToElement(currentLetterBox, 'displaced-letter');
        UIHandler.addClassToElement(keyBtn, 'displaced-letter');
      } else {
        UIHandler.addClassToElement(currentLetterBox, 'wrong-letter');
        UIHandler.addClassToElement(keyBtn, 'wrong-letter');
      }

    }

    nexSteps();
  }
  
}

function removeAccentsFromWord(word) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function showResultDialog(hasWon) {
  if (hasWon) {
    addResultBody('Você ganhou!');
  } else {
    addResultBody('Que pena, você perdeu...');
  }

  resultDialog.showModal();
}

function addResultBody(title) {
  const resultBody = resultDialog.querySelector('.result');

  resultBody.innerHTML = `
    <h2>${title}</h2>
    <p>A palavra escolhida era: <strong>${chosenWord}</strong></p>
  `;
}

function showInvalidWordWarning() {
  const currentLineElement = getCurrentLineElement();
  const children = currentLineElement.children;

  UIHandler.addClassToChildren(children, 'invalid-word');
}

function removeInvalidWordWarning() {
  const currentLineElement = getCurrentLineElement();
  const children = currentLineElement.children;

  UIHandler.removeClassFromChildren(children, 'invalid-word');
}

function nexSteps() {
  console.log(currentLine)
  if (currentLine < 5) {
    goToNextLine();
  } else {
    showResultDialog(false);
  }
  
}

function goToNextLine() {
  currentLine++;
  currentLetter = 0;
  formedWord = '';
}
