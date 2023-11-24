const template = document.createElement('template');
template.innerHTML = `
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
    this.shadowRoot.appendChild(template.cloneNode(true));

    this.stats = JSON.parse(localStorage.getItem('stats')) || {
        totalPlays: 0,
        totalWins: 0,
        currentStreak: 0,
        maxStreak: 0
      };
      
    
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
    this.shadowRoot.querySelector('#total-plays').textContent = this.stats.totalPlays;
    this.shadowRoot.querySelector('#total-wins').textContent = `${this.stats.totalWins / this.stats.totalPlays} %`;
    this.shadowRoot.querySelector('#current-streak').textContent = this.stats.currentStreak;
    this.shadowRoot.querySelector('#max-streak').textContent = this.stats.maxStreak;
  }

  _saveStatsStorage() {
    localStorage.setItem('stats', JSON.stringify(this.stats));
  }

  _styles() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        color: var(--font-color);
      }

      .container {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .container div {
        padding: 4px;
      }
    `;
    return style;
  }

}

window.customElements.define('stats', Stats);