const debounce = (func, wait = 100) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

class BinaryRain {
  constructor(selector) {
    this.canvas = document.querySelector(selector);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.animationFrame = null;
    this.lastFrame = 0;
    this.frameInterval = 1000 / 30;
    
    this.init();
  }

  init() {
    this.setCanvasSize();
    this.createDrops();
    this.setupEvents();
    this.startAnimation();
  }

  setCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.columns = Math.floor(this.width / this.fontSize);
    this.ctx.font = `${this.fontSize}px 'Space Mono'`;
  }

  createDrops() {
    this.drops = Array.from({length: this.columns}, () => ({
      pos: Math.random() * -this.height,
      speed: Math.random() * 0.5 + 0.5
    }));
  }

  draw() {
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.03)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary').trim() || '#00FF00';
    
    this.drops.forEach((drop, i) => {
      this.ctx.fillStyle = primaryColor;
      this.ctx.globalAlpha = Math.random() * 0.3 + 0.2;
      this.ctx.fillText(
        Math.random() > 0.5 ? '0' : '1',
        i * this.fontSize,
        drop.pos * this.fontSize
      );

      drop.pos = drop.pos > this.height / this.fontSize 
        ? Math.random() * -20 
        : drop.pos + drop.speed;
    });
    
    this.ctx.globalAlpha = 1;
  }

  animate(timestamp) {
    if (!document.hidden) {
      const delta = timestamp - this.lastFrame;
      
      if (delta > this.frameInterval) {
        this.draw();
        this.lastFrame = timestamp;
      }
      this.animationFrame = requestAnimationFrame(t => this.animate(t));
    }
  }

  startAnimation() {
    if (!this.animationFrame) {
      this.lastFrame = performance.now();
      this.animationFrame = requestAnimationFrame(t => this.animate(t));
    }
  }

  setupEvents() {
    const resizeHandler = debounce(() => {
      this.setCanvasSize();
      this.createDrops();
    }).bind(this);
    
    window.addEventListener('resize', resizeHandler);
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      } else {
        this.startAnimation();
      }
    });
  }
}
new BinaryRain('.binary-rain');