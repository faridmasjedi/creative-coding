const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};


const info = {
  ellipseNum : 10,
  // get ellipseDiffYFactor() {return 1024 / this.ellipseNum},
  ellipseDiffYFactor: 10,
  ellipseRxFactor: 50,
  ellipseRYFactor: 10,
  ellipseOn: true,
  circleNum: 1,
  circleIncrementalFactor: 1,
  respectABS: true,
  updateCircleXFactor: 1,
  randomUpdateXFactor: 1
}
console.log(info)
const particles = []

const sketch = ({width, height}) => {
  for(let i = 0; i < info.ellipseNum; i++){
    const x = width / 2 
    const y = height / 2 + i * height/info.ellipseDiffYFactor
    const yy = height / 2 - i * height/info.ellipseDiffYFactor

    const rx = (info.ellipseNum-i) * width / info.ellipseRxFactor
    const ry = height / (info.ellipseRYFactor * ( i + 1 ))
    const p = new Particle(x,y,rx,ry)
    p.findCirclesPoints()
    const pp = new Particle(x,yy,rx,ry)
    pp.findCirclesPoints()

    particles.push(p)
    particles.push(pp)
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.drawElipse(context)
      p.updateCirclePoints()
      p.drawCircle(context, height)
    })
  };
};


class Particle {
  constructor(x,y,rx,ry){
    this.x = x
    this.y = y
    this.rx = rx
    this.ry =ry
    this.circleP = []
  }

  drawElipse(context) {
    context.beginPath();
    context.strokeStyle = info.ellipseOn ? 'red' : 'black'
    context.ellipse(this.x, this.y, this.rx, this.ry, 0, 0, 2* Math.PI)
    context.stroke()
  }


  findCirclesPoints() {
    for ( let xdiff = - this.rx/info.circleNum; xdiff <= this.rx; xdiff += this.rx/(info.circleIncrementalFactor*info.circleNum)){
      const x = this.x + xdiff 
      const xx = this.x - xdiff
      const dd = 1-(x - this.x)**2 / this.rx ** 2
      const dy = this.ry * Math.sqrt(dd >= 0 ? dd : (info.respectABS ? Math.abs(dd) : 0))
      const y = this.y + dy
      const yy = this.y - dy
      this.circleP.push({x, y, incrX: -1, incrY: false}, {x, y: yy,incrX: -1, incrY: false}, {x: xx, y,incrX: -1, incrY: false}, {x: xx, y: yy,incrX: -1, incrY: false})
    }
  }


  updateCirclePoints() {
    this.circleP.forEach(co => {
      if ((co.x >= this.rx + this.x) && co.incrX === 1) {
        co.incrX *= -1
        co.incrY = false
      }
      if ((co.x <= -this.rx + this.x) && co.incrX === -1) {
        co.incrX *= -1
        co.incrY = true
      }

      co.x += co.incrX * (info.randomUpdateXFactor > 1 ? info.randomUpdateXFactor * Math.random() : 1 ) 
      const dd = 1-(co.x - this.x)**2 / this.rx ** 2
      const dy = this.ry * Math.sqrt(dd >= 0 ? dd : (info.respectABS ? Math.abs(dd) : 0) )
      if (co.incrY){
        co.y = this.y + dy
      }else{
        co.y = this.y - dy
      }
    })
  }

  drawCircle(context, height) {
    this.circleP.forEach(co => {
      const dy = co.y - this.y
      const dx = Math.abs(co.x - this.x)
      const rgap = dy / 5 - dx/100
      const r = 5 + 60 / height * this.y - 60 / height ** 2 * this.y ** 2 + rgap
      context.beginPath()
      context.fillStyle = 'white'
      context.arc(co.x, co.y, r >= 0 ? r : 5 , 0, 2 * Math.PI)
      context.fill()
    })
  }
}

canvasSketch(sketch, settings);
