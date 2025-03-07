const canvasSketch = require("../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

const particles = [];
const cursor = { x: 9999, y: 9999 };

let elCanvas;
let image;
let imageLoaded = false;
let circleRadius = 100;
let maxRadius = 1000;
let firstRadius = 50;
let reducedRadiusFactor = 150;

const sketch = ({ width, height, canvas }) => {
  elCanvas = canvas;

  // Handle image upload
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.position = "absolute";
  fileInput.style.top = "10px";
  fileInput.style.left = "10px";
  fileInput.style.zIndex = "10";
  document.body.appendChild(fileInput);

  fileInput.addEventListener("change", handleImageUpload);

  canvas.addEventListener("mousedown", mouseHandler);

  for (let r = circleRadius; r <= maxRadius; r += circleRadius) {
    const circleNum = Math.floor(r / firstRadius);
    const theta = (2 * Math.PI) / circleNum;
    for (let t = 0; t < 2 * Math.PI; t += theta) {
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      const p = new Particle(
        x,
        y,
        width / 2,
        height / 2,
        firstRadius - 1 - (2 * r) / reducedRadiusFactor
      );
      particles.push(p);
    }
  }

  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      imageLoaded ? p.drawScaledImage(context) : p.drawCircle(context);
    });
  };
};

class Particle {
  constructor(x, y, w, h, r = 20) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.w = w;
    this.h = h;
    this.color = "white";
    this.iColor = "white";

    this.ix = x;
    this.iy = y;
    this.ir = r;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    this.minDist = 400;
    this.pushFactor = 0.015;
    this.pullFactor = 0.008;
    this.dempFactor = 0.98;
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

  drawScaledImage(context) {
    if (!imageLoaded) return;

    context.save();
    context.translate(this.w, this.h);
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    context.closePath();
    context.clip();

    // Calculate relative positions in the image
    const sx = ((this.x + this.w) / elCanvas.width) * image.width;
    const sy = ((this.y + this.h) / elCanvas.height) * image.height;
    const sw = image.width / 10; // Take a smaller slice
    const sh = image.height / 10;

    // Stretch that slice to fit the circle
    context.drawImage(
      image,
      sx,
      sy,
      sw,
      sh, // Source
      this.x - this.r,
      this.y - this.r,
      this.r * 2,
      this.r * 2 // Destination
    );

    context.restore();
  }

  update() {
    let dx, dy, dd, distDelta;

    // Pull back to original position
    dx = this.ix - this.x;
    dy = this.iy - this.y;

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    // Push away from the cursor
    dx = this.x + this.w - cursor.x;
    dy = this.y + this.h - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    this.r = Math.abs(this.ir + this.vx);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
      if (!imageLoaded) this.updateColor(dx, dy, distDelta);
    }

    this.vx = (this.vx + this.ax) * this.dempFactor;
    this.vy = (this.vy + this.ay) * this.dempFactor;

    this.x += this.vx;
    this.y += this.vy;
  }

  updateColor(dx, dy, distDelta) {
    const r = Math.floor(Math.random() * dx);
    const b = Math.floor(Math.random() * dy);
    const g = Math.floor(Math.random() * Math.abs(distDelta));
    this.color = `rgba(${r}, ${g}, ${b})`;
  }
}

// Handle mouse movement
const mouseHandler = (e) => {
  window.addEventListener("mousemove", onMouseMove);
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
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  cursor.x = 9999;
  cursor.y = 9999;
};

// Load Image from File Input
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    image = new Image();
    image.onload = () => {
      imageLoaded = true;
    };
    image.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

canvasSketch(sketch, settings);
