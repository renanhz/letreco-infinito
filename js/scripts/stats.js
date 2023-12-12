import GameStorage from "./storage.js";

const template = document.createElement('template');
template.innerHTML = `
  <h3>Estatísticas</h3>
  <div class="container">
    <div>
      <h4 id="total-plays"></h4>
      Vezes jogadas
    </div>

    <div>
      <h4 id="total-wins"></h4>
      de vitória
    </div>

    <div>
      <h4 id="current-streak"></h4>
      sequência atual
    </div>

    <div>
      <h4 id="max-streak"></h4>
      maior sequência
    </div>
  </div>
`;

export default class Stats extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this._styles());
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.stats = GameStorage.getStats();
      
    this._updateTemplate();
  }

  updateStats(hasWon) {
    this.stats.totalPlays++;

    if (hasWon) {
      this.stats.totalWins++;
      this.stats.currentStreak++;
      
      if( this.stats.currentStreak > this.stats.maxStreak) {
        this.stats.maxStreak = this.stats.currentStreak;
      }
    } else {
      this.stats.currentStreak = 0;
    }

    this._updateTemplate();
    this._saveStatsStorage();
  }

  _updateTemplate() {
    this.shadowRoot.querySelector('#total-plays').innerText = this.stats.totalPlays;
    this.shadowRoot.querySelector('#total-wins').innerText = `${(this.stats.totalWins / this.stats.totalPlays)*100}%`;
    this.shadowRoot.querySelector('#current-streak').innerText = this.stats.currentStreak;
    this.shadowRoot.querySelector('#max-streak').innerText = this.stats.maxStreak;
  }

  _saveStatsStorage() {
    GameStorage.saveStats(this.stats);
  }

  _styles() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        color: var(--font-color);
      }

      h4 {
        white-space: nowrap;
        margin 0.5em 0 !imprtant;
      }

      .container {
        flex-wrap: wrap;
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .container div {
        padding: 4px;
        margin: 0 1em;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      @media (max-width: 425px) {
        .container {
          flex-direction: column;
        }
      }
    `;
    return style;
  }

}
window.customElements.define('game-stats', Stats);