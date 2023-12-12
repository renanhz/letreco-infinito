export default class GameStorage {

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

  static saveStats(stats) {
    localStorage.setItem('stats', JSON.stringify(stats));
  }

  static getStats() { 
    return JSON.parse(localStorage.getItem('stats')) || {
      totalPlays: 0,
      totalWins: 0,
      currentStreak: 0,
      maxStreak: 0
    };
  }
}