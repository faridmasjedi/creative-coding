const canvasSketch = require('../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    const infoObj = { context, width, height }
    infoObj.r = 400;
    infoObj.num = 12
    drawInTime(infoObj)
  }
};

const resetBackground = (infoObj) => {
  const context = infoObj.context;
  const width = infoObj.width;
  const height = infoObj.height;

  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
}

const draw = (infoObj) => {
  const context = infoObj.context;
  for(let i=0; i<infoObj.num; i++){
    const angle = i * 2 * Math.PI/infoObj.num
    context.fillStyle = 'black';
    infoObj.angle = angle
    drawRect(infoObj)
    drawArc(infoObj)
  }
}

const drawRect = (infoObj) => {
  const width = infoObj.width
  const height = infoObj.height
  const context = infoObj.context
  const r = infoObj.r
  const angle = infoObj.angle

  context.save();
  context.translate(width/2 + r*Math.cos(angle) , height/2+ r*Math.sin(angle));
  context.rotate(angle)
  context.scale(Math.random() , Math.random() * 2)
  context.beginPath();
  context.rect(-height/20, -width/200,  height/10, width/100)
  context.fill()
  context.restore()
}

const drawArc = (infoObj) => {
  const width = infoObj.width
  const height = infoObj.height
  const context = infoObj.context
  const r = infoObj.r
  const angle = infoObj.angle

  context.lineWidth = '' + Math.random() * 20
  context.save()
  context.beginPath()
  context.translate(width/2, height/2)
  context.arc(0,0, r + Math.random()* width/10, Math.random() * angle, Math.random() * angle)
  context.stroke()
  context.restore()
}

const drawInTime = (infoObj) => {
  setInterval(() => {
    resetBackground(infoObj)
    draw(infoObj)
  }, 1000)
}

canvasSketch(sketch, settings);
