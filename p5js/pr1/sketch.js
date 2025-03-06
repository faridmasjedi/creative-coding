let circleX;
let circleY;
let extraCanvas;
function setup() {
  createCanvas(800, 600);
  extraCanvas = createGraphics(800, 600)
  extraCanvas.background(255,0,0)
  extraCanvas.clear()
  background(0)
  circleX = 400
  circleY = 300
}

function draw() {
  background(0, 0, 0)
  
  rectMode(CENTER)
  noStroke()
  fill(255,255, 255)
  circle(circleX,circleY,24)
  circleX = mouseX
  circleY = mouseY
  if (mouseIsPressed){
    const xc = random(0,width)
    const yc = random(0, height)
    extraCanvas.noStroke()
    extraCanvas.fill(random(0,255), random(0,255), random(0,255), 255)
    extraCanvas.rect(xc,yc,10,10)
  }
  image(extraCanvas, 0,0)
}