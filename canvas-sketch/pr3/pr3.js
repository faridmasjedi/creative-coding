const canvasSketch = require('../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

const sketch = ({ context, width, height }) => {
  const objInfo = { context, width, height }
  const points = pointsArray(width, height, 40);
  objInfo.points = points

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    pointsMotion(objInfo)
  };
};

class Point {
  constructor(x,y, r){
    this.x = x
    this.y = y
    this.r = r
    this.vX = Math.random()* 3
    this.vY = Math.random()* 5
  }

  draw(ctx) {
    ctx.lineWidth = '5'
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2* Math.PI)
    ctx.stroke()
  }

  move(width, height) { 
    if (this.x <= 0 || this.x >= width) this.vX *= -1
    if (this.y <= 0 || this.y >= height) this.vY *= -1

    this.x += this.vX 
    this.y += this.vY
  }

  drawLine(ctx, xx, yy){
    const dx = this.x - xx
    const dy = this.y - yy
    const dist = Math.sqrt(dx **2 + dy ** 2)
    if (dist > 200) return;
    
    ctx.lineWidth = '' + dist/100
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(xx,yy)
    ctx.fill()
    ctx.stroke()
  }

}

const pointsArray = (width, height, num) => {
  const points = []
  for (let i=0; i < num; i++){
    const p = new Point(Math.random() * width, Math.random() * height, Math.random() * 19 + 3)
    points.push(p)
  }
  return points;
}

const pointsMotion = (infoObj) => {
  infoObj.points.forEach(point => {
    point.draw(infoObj.context);
    point.move(infoObj.width, infoObj.height);
  });

  for( let i = 0; i< infoObj.points.length; i++){
    for(let j=i+1; j<infoObj.points.length; j++){
      const currentP = infoObj.points[i];
      const otherP = infoObj.points[j]
      currentP.drawLine(infoObj.context,otherP.x, otherP.y)
    }
  }
}

canvasSketch(sketch, settings);
