class TerminalLoader {
  constructor() {
    this.loader = document.querySelector('.loader-container');
    this.terminal = document.querySelector('.terminal-loader');
    this.mainContent = document.querySelector('.container');
    this.text = "whoami";
    this.index = 0;
    
    if (this.loader && this.terminal && this.mainContent) this.init();
  }

  init() {
    this.terminal.innerHTML = '<span class="prompt">$ </span><span class="typed-text"></span>';
    this.typedText = this.terminal.querySelector('.typed-text');
    this.typeCharacter();
  }

  typeCharacter() {
    if (this.index < this.text.length) {
      this.typedText.textContent += this.text[this.index++];
      setTimeout(() => this.typeCharacter(), 200);
    } else {
      this.terminal.insertAdjacentHTML('beforeend', '<span class="loader-cursor"></span>');
      this.hideLoader();
    }
  }

  hideLoader() {
    this.loader.style.opacity = '0';
    setTimeout(() => {
      this.loader.remove();
      this.mainContent.style.display = 'block';
    }, 1000);
  }
}
new TerminalLoader();