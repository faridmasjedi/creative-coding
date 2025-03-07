const canvasSketch = require("../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd");
const random = require("canvas-sketch-util/random");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

const randomNumber = (num) => Math.random() * num;
const randomRGB = () =>
  `rgba(${randomNumber(255)}, ${randomNumber(255)}, ${randomNumber(
    255
  )}, ${randomNumber(1)})`;

const info = {
  rowNum: 10,
  colNum: 120,
  fr: 0.002,
  amp: 90,
  marginC: 0.9,
  xcConf: 0.8,
  ycConf: 5.5,
  cConf: 150,
  changeLineWidth: false,
  drawPoints: false,
  pointsR: 5,
  background: "rgba(32,32,32,0.5)",
};

const resetBackground = ({ context, width, height }) => {
  context.fillStyle = info.background;
  context.fillRect(0, 0, width, height);
};

class Grid {
  constructor(width, height) {
    this.rowNum = info.rowNum;
    this.colNum = info.colNum;
    this.count = info.rowNum * info.colNum;
    this.rowGap = (height / (info.rowNum + 1)) * info.marginC;
    this.colGap = (width / (info.colNum + 1)) * info.marginC;
    this.positionsObj = {};
    this.firstPositionObj = {};
    this.lineInfo = {};
  }

  createLineInfo() {
    let preserevedColor;
    for (let i = 0; i < this.count; i++) {
      if (i % this.colNum === 0) preserevedColor = randomRGB();
      this.lineInfo[i] = {
        color: preserevedColor,
        lineW: info.changeLineWidth ? Math.ceil(randomNumber(20)) : 10,
      };
    }
  }

  findPointPositions(width, height) {
    console.log(this.colGap, this.rowGap);
    for (let i = 0; i < this.count; i++) {
      const x =
        ((i % this.colNum) + 1) * this.colGap +
        (width * (1 - info.marginC)) / 2;
      const y =
        Math.floor(i / this.colNum + 1) * this.rowGap +
        (height * (1 - info.marginC)) / 2;
      const n = random.noise2D(x, y, info.fr, info.amp);
      this.positionsObj[i] = { x: x + n, y: y + n };
    }
    this.firstPositionObj = { ...this.positionsObj };
  }

  updatePos(frame) {
    const pointsObj = this.positionsObj;

    for (let index in pointsObj) {
      const noise = random.noise2D(
        pointsObj[index].x + frame,
        pointsObj[index].y,
        info.fr,
        1
      );
      const flag = Math.random() > 0.5 ? 1 : -1;
      pointsObj[index].x += flag * noise;
    }
    return pointsObj;
  }

  draw(context) {
    const pointsObj = this.positionsObj;
    for (let i in pointsObj) {
      const { x, y } = pointsObj[i];
      context.beginPath();
      context.fillStyle = "red";

      context.arc(x, y, info.pointsR, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawCurves(context) {
    if (info.drawPoints) this.draw(context);

    const pointsArr = Object.values(this.positionsObj);
    let lastx, lasty;

    for (let r = 0; r < this.rowNum; r++) {
      for (let c = 0; c < this.colNum - 1; c++) {
        const currP = pointsArr[r * this.colNum + c];
        const nextP = pointsArr[r * this.colNum + c + 1];

        let xc = currP.x + (nextP.x - currP.x) * info.xcConf;
        let yc = currP.y + (nextP.y - currP.y) * info.ycConf;

        if (c === 0) {
          lastx = currP.x;
          lasty = currP.y;
        } else if (c === this.colNum - 2) {
          xc = nextP.x;
          yc = nextP.y;
        }
        const lineInfo = this.lineInfo[r * this.colNum + c];

        context.beginPath();
        context.strokeStyle = lineInfo.color;
        context.lineWidth = lineInfo.lineW;
        context.moveTo(lastx, lasty);
        context.quadraticCurveTo(currP.x, currP.y, xc, yc);
        context.stroke();

        lastx = xc - (c / this.colNum) * info.cConf;
        lasty = yc - (r / this.rowNum) * info.cConf;
      }
    }
  }
}

const sketch = ({ context, width, height }) => {
  const grid = new Grid(width, height);
  grid.findPointPositions(width, height);
  grid.createLineInfo();
  grid.drawCurves(context, width, height);
  return ({ context, width, height, frame }) => {
    resetBackground({ context, width, height });
    const updatePosObj = grid.updatePos(frame);
    grid.positionsObj = { ...updatePosObj };
    grid.drawCurves(context, width, height);
  };
};

canvasSketch(sketch, settings);
