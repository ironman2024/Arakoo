import { LitElement, html, css } from '../../assets/lit-core-2.7.4.min.js';

class CheatingDaddyApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .container {
      width: 100%;
      height: 100%;
      background: transparent;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      background: var(--header-background);
      padding: var(--header-padding);
      border-radius: var(--border-radius) var(--border-radius) 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-color);
    }
    
    .content {
      flex: 1;
      background: var(--main-content-background);
      padding: var(--main-content-padding);
      border-radius: 0 0 var(--content-border-radius) var(--content-border-radius);
      overflow: hidden;
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="header">
          <span>Cheating Daddy</span>
        </div>
        <div class="content">
          <div id="main-content"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('cheating-daddy-app', CheatingDaddyApp);