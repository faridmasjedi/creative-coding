const canvasSketch = require('../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

const params = {
  cols: 10,
  rows: 10,
  lineWidth: 100,
  lineHeight:10,
  fq: 0.001,
  amp: 0.2
}

const maxLength = (length, count) => Math.floor(length/count)

const findLength = (length, count, chosenLength, name) => {
  const maxLen = maxLength(length, count);
  return chosenLength <= maxLen ? chosenLength : (() => {
    console.log(`${name} has been changed from ${chosenLength} to max: ${maxLen}.`)
    return maxLen;
  })()
}

const randomNoise = (x,y, frame, fr, amp) => {
  const n = random.noise2D(x + frame,y, fr)
  const angle = n * Math.PI * amp;
  return angle
}

const drawLines = (infoObj) => {
  
  const ctx = infoObj.context;
  const rowN = infoObj.rowN;
  const colN = infoObj.colN;
  const frame = infoObj.frame;
  const gapX = infoObj.gapX;
  const gapY = infoObj.gapY;
  const lineW = infoObj.lineW;
  const lineH = infoObj.lineH;
  const fq = infoObj.fq;
  const amp = infoObj.amp;

  let y = 0;
  let x = gapX;
  for(let i=0; i<rowN * colN; i++){
    const rowIndex = i % rowN;
    
    x = rowIndex === 0 ? gapX : (lineW + gapX) * rowIndex + gapX
    y = rowIndex === 0 ? y + gapY : y
    const angle = randomNoise(x,y, frame*10, fq, amp);
    
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.translate(x,y);
    ctx.rotate(angle)
    ctx.beginPath();
    ctx.rect(0,0,lineW,lineH);
    ctx.fill()
    ctx.restore();
  }

  
}

const sketch = ({ context, width, height }) => {
  const infoObj = { 
    context, 
    width, 
    height,
    rowN: params.rows,
    colN: params.cols,
    lineW: params.lineWidth,
    lineH: params.lineHeight,
    fq: params.fq,
    amp: params.amp
  }

  infoObj.lineH = findLength(infoObj.height,infoObj.colN, 10, 'Line height');
  infoObj.lineW = findLength(infoObj.width,infoObj.rowN, 100, 'Line width');
  infoObj.gapX = (infoObj.width-infoObj.rowN*infoObj.lineW)/(infoObj.rowN+1);
  infoObj.gapY = infoObj.height/(infoObj.colN+1)

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    infoObj.frame = frame
    drawLines(infoObj)
  };
};


canvasSketch(sketch, settings);
