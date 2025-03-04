const canvasSketch = require('../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    drawEachSecond(context, width, height)
  };
};

const drawRects = (context) => {
  const w = 150;
  const h = 150;
  
  for(let i = w; i< Math.floor(2048/150)*150; i+=200){
    for(let j= h; j <Math.floor(2048/150)*150; j+= 200){
      context.beginPath();
      context.rect(i, j, w,h);
      context.stroke();

      const randomNumber = w/4 * (Math.random());
      context.beginPath();
      context.lineWidth = Math.ceil(randomNumber);
      context.rect(i+randomNumber, j+randomNumber, w-2*randomNumber, h-2*randomNumber)
      context.stroke()
    }
  }
}

const resetCanvas = (context, width, height) => {
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
}

const drawEachSecond = (context, width, height) => {
  setInterval(() => {
    resetCanvas(context,width,height)
    drawRects(context)
  }, 1000)
}

canvasSketch(sketch, settings);
