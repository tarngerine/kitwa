class Draw {
  constructor(canvas, w, h) {
    this.strokes = [];
    // this.canvas = this.createBackingCanvas(parent);
    // TODO: Can we do this without passing w, h?
    this.canvas = this.setupCanvas(canvas, w, h);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.mouse = {
      last: {
        x: 0,
        y: 0,
      },
      current: {
        x: 0,
        y: 0,
      }
    }
    this.drawing = false;

    this.canvas.addEventListener('mousedown', e => {
      console.log("down")
      const m = this.getMouse(e);
      this.mouse.current.x = m.x;
      this.mouse.last.x = m.x;
      this.mouse.current.y = m.y;
      this.mouse.last.y = m.y;
      this.drawing = true;
      this.canvas.setCapture();
      this.strokes.push({...this.mouse.current});
    });
    
    this.canvas.addEventListener('mousemove', e => {
      const m = this.getMouse(e);
      this.mouse.current.x = m.x;
      this.mouse.current.y = m.y;
      if (this.drawing) {
        this.ctx.moveTo(this.mouse.last.x, this.mouse.last.y);
        this.ctx.lineTo(this.mouse.current.x, this.mouse.current.y);
        this.strokes.push({...this.mouse.current});
        this.ctx.stroke();
      }
      this.mouse.last.x = this.mouse.current.x;
      this.mouse.last.y = this.mouse.current.y;
    });
    
    this.canvas.addEventListener('mouseup', e => {
      this.strokes.push(null); // stop stroke on redraw
      this.drawing = false;
      document.releaseCapture();
    });
  }

  get getStrokes() {
    return this.strokes;
  }

  getMouse(e) {
    return {
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top,
    }
  }

  // Create a canvas sized to the parent, absolutely positioned
  createBackingCanvas(parent) {
    const canvas = document.createElement('canvas');
    canvas.width = parent.getBoundingClientRect().width;
    canvas.height = parent.getBoundingClientRect().height;
    parent.appendChild(canvas);
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.height = canvas.height;
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;
    return canvas;
  }

  // Create a canvas sized to the parent, absolutely positioned
  setupCanvas(canvas, w, h) {
    canvas.width = w;
    canvas.height = h;
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.height = canvas.height;
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;
    return canvas;
  }
}

export {Draw};