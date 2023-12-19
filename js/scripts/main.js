import { VALID_GUESSES } from "../constants/validGuesses.js";
import { WORDS } from "../constants/wordlist.js";
import { MAX_LETTERS, MAX_LINES, KEYS } from "../constants/consts.js";
import UIHandler from './uiHandler.js';
import Stats from './stats.js';
import GameStorage from "./storage.js";

const wordContainer = document.querySelector('.word-container');
const keyboardContainer = document.querySelector('.keyboard-container');
const howToDialog = document.querySelector('#how-to-dialog');
const resultDialog = document.querySelector('#result-dialog');

let currentLetter = 0;

let formedWord = '';
let chosenWord = '';

let currentGame = GameStorage.getGame();  
let currentLine = currentGame.guesses.length;

renderLetterBoxes();
renderKeyboard();

const storageChosenWord = GameStorage.getChosenWord();
if (storageChosenWord) {
  chosenWord = storageChosenWord;
} else {
  chooseRandomWord();
}

function chooseRandomWord() {
  chosenWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  
  GameStorage.saveChosenWord(chosenWord);
}

function renderLetterBoxes() {
  for (let lineIndex = 0; lineIndex < MAX_LINES; lineIndex++ ) {
    const savedLine = currentGame.guesses[lineIndex];
    const line = document.createElement('div');
    line.className = 'word-line';

    for (let letterIndex = 0; letterIndex < MAX_LETTERS; letterIndex++) {
      const letter = document.createElement('div');
      letter.className = 'word-letter';

      if (savedLine) {
        letter.textContent = savedLine[letterIndex].letter;
        letter.classList.add(savedLine[letterIndex].class);
      }
  
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

  if (currentGame.letters[key]) {
    keyBox.classList.add(currentGame.letters[key]);
  }

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
    currentLetterElement.textContent = key.toUpperCase();
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

  const children = getCurrentLineElement().children;

  const chosenWordNormalized = removeAccentsFromWord(chosenWord);
  const formedWordLowerCase = formedWord.toLowerCase();

  if (formedWordLowerCase === chosenWordNormalized) {
    UIHandler.addClassToChildren(children, 'right-letter');

    showResultDialog(true);
    GameStorage.clearGame();
  } else {
    currentGame.guesses[currentLine] = [];

    for(let i = 0; i < formedWordLowerCase.length; i++) {
      const formedWordLetter = formedWordLowerCase.charAt(i);
      const chosenWordLetter = chosenWordNormalized.charAt(i);

      const currentLetterBox = children.item(i);
      const keyBtn = document.querySelector(`[data-key="${formedWordLetter}"]`);
      
      if (formedWordLetter === chosenWordLetter) {
        updateCurrentLineElement(currentLetterBox, i, keyBtn, 'right-letter');
      } else if (chosenWordNormalized.includes(formedWordLetter)) {
        updateCurrentLineElement(currentLetterBox, i, keyBtn, 'displaced-letter');
      } else {
        updateCurrentLineElement(currentLetterBox, i, keyBtn, 'wrong-letter');
      }

    }

    nexSteps();
  }
  
}

function updateCurrentLineElement(currentLetterBox, index, key, className) {
  currentGame.guesses[currentLine][index] = {letter: key.textContent, class: className};
  currentGame.letters[key.textContent] = className;
  UIHandler.addClassToElement(currentLetterBox, className);
  UIHandler.addClassToElement(key, className);
}

function removeAccentsFromWord(word) {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function showResultDialog(hasWon) {
  addResultBody(hasWon);

  resultDialog.showModal();
}

function addResultBody(hasWon) {
  const formerChosenWord = chosenWord;
  const resultBody = resultDialog.querySelector('.result');
  const title = hasWon ? 'Você ganhou!' : 'Que pena, você perdeu...';

  reset();

  resultBody.innerHTML = `
    <h2>${title}</h2>
    <p>A palavra escolhida era: <strong>${formerChosenWord}</strong></p>
  `;

  const stats = document.createElement('game-stats');
  stats.updateStats(hasWon);

  resultBody.appendChild(stats);
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
  if (currentLine < 5) {
    GameStorage.saveGame(currentGame);
    goToNextLine();
  } else {
    showResultDialog(false);
    GameStorage.clearGame();
  }
  
}

function goToNextLine() {
  currentLine++;
  currentLetter = 0;
  formedWord = '';
}

function reset() {
  GameStorage.clearGame();
  currentGame = GameStorage.getGame();
  chooseRandomWord();

  wordContainer.innerHTML = '';
  renderLetterBoxes();

  keyboardContainer.innerHTML = '';
  renderKeyboard();

  formedWord = '';
  currentLine = 0;
  currentLetter = 0;
}
