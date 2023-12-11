export default class Storage {

  static saveGame(content) {
    localStorage.setItem('currentGame', JSON.stringify(content));
  }
  
  static clearGame() {
    localStorage.clear('currentGame');
  }
  
  static getGame() {
    const game = localStorage.getItem('currentGame');

    return game? JSON.parse(game) : {guesses: [], letters: {}};
  }

  static saveChosenWord(chosenWord) {
    localStorage.setItem('chosenWord', chosenWord);
  }

  static getChosenWord() {
    return localStorage.getItem('chosenWord');
  }
}