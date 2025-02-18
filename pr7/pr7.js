const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  // animate: true
};

const randomNumber = (num) => Math.random() * (num-1) + 1
const randomRGBA = () => `rgb(${randomNumber(255)}, ${randomNumber(255)}, ${randomNumber(255)}, ${randomNumber(255)})`

const sketch = ({ context, width, height, frame }) => {
  let runFlag = false
  return ({ context, width, height, frame }) => {
    
    if (frame%30 === 0 ) runFlag = true
    if (frame > 10000 ) return;

    if (runFlag){
      context.fillStyle = randomRGBA();
      context.fillRect(0, 0, width, height);
      const x = width/2
      const y = height/2
      const rx = 682
      const ry = 200
      const randomX = randomNumber(100)
      context.save()
      context.translate(x,y)
  
      context.fillStyle = randomRGBA()
      context.beginPath()
      context.moveTo(0,-rx)
      context.lineTo(rx - randomX, ry)
      context.lineTo(-rx + randomX, ry)
      context.closePath()
      context.fill()
  
      context.clip()
  
      for(let i = 0; i<20; i++){
        const w = randomNumber(width)
        const h = randomNumber(height)
        const gapX = randomNumber(w) + 100
        const gapY = randomNumber(h) + 100
        context.save();
        context.translate(x,y)
        
        context.beginPath()
        context.fillStyle = randomRGBA()
        context.moveTo(w + gapX, -h)
        context.lineTo(w + gapX, h)
        context.lineTo(-w, h+gapY)
        context.lineTo(-w ,-h + gapY)
        context.closePath()
        context.stroke()
        context.fill()
        context.restore();
      }
      runFlag = false
    }
    
  };
};

canvasSketch(sketch, settings);
