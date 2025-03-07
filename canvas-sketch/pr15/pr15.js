const canvasSketch = require("../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

const particles = [];
const cursor = { x: 9999, y: 9999 };

let elCanvas;
let lineOff = true;

const signRand = () => (Math.random() > 0.5 ? 1 : -1);

const sketch = ({ width, height, canvas }) => {
  elCanvas = canvas;

  canvas.addEventListener("mousedown", mouseHandler);

  for (let i = 0; i < 200; i++) {
    const x = signRand() * i * Math.random() * 5;
    const y = signRand() * i * Math.random() * 5;
    const p = new Particle(x, y, width / 2, height / 2);
    particles.push(p);
  }

  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.drawCircle(context);
      p.drawLine(context);
    });
  };
};

class Particle {
  constructor(x, y, w, h, r = 20) {
    this.x = x;
    this.y = y;
    this.color = "white";

    this.r = r;
    this.w = w;
    this.h = h;

    this.ix = x;
    this.iy = y;
    this.ir = r;
    this.iColor = "white";

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    this.minDist = 400;
    this.pushFactor = 0.015;
    this.pullFactor = 0.008;
    this.dempFactor = 0.95;
  }

  drawCircle(context) {
    context.save();

    context.translate(this.w, this.h);
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.fill();

    context.restore();
  }

  drawLine(context) {
    if (lineOff) return;
    let dx, dy, dd;

    dx = this.ix - this.x;
    dy = this.iy - this.y;
    dd = Math.sqrt(dx ** 2 + dy ** 2);

    context.save();
    context.translate(this.w, this.h);
    context.strokeStyle = "red";

    context.lineWidth = Math.floor(dd / 20);
    context.beginPath();
    context.moveTo(this.ix, this.iy);
    context.lineTo(this.x, this.y);
    context.stroke();

    context.restore();
  }

  update() {
    let dx, dy, dd, distDelta;

    // pull back
    dx = this.ix - this.x;
    dy = this.iy - this.y;

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    // push back
    dx = this.x + this.w - cursor.x;
    dy = this.y + this.h - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    this.r = Math.abs(this.ir + this.vx);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
      const r = Math.random() * dx;
      const b = Math.random() * dy;
      const g = Math.random() * distDelta;
      this.color = `rgba(${r}, ${g}, ${b})`;
    }

    this.vx = (this.vx + this.ax) * this.dempFactor;
    this.vy = (this.vy + this.ay) * this.dempFactor;

    this.x += this.vx;
    this.y += this.vy;
  }
}

const mouseHandler = (e) => {
  window.addEventListener("mousedown", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  onMouseMove(e);
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
  cursor.x = x;
  cursor.y = y;
};

const onMouseUp = () => {
  window.removeEventListener("mousedown", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  cursor.x = 9999;
  cursor.y = 9999;
};

canvasSketch(sketch, settings);
