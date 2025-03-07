let starCount = 800;
let stars = [];

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < starCount; i++){
    const x = random(-width/2 , width/2)
    const y = random(-height/2, height/2)
    const z = random(width/100)

    const star = new Star(x, y, z)
    stars.push(star)
  }
}

function draw() {
  background(0);
  translate(width/2, height/2)
  stars.forEach(star => {
    star.update()
    star.draw()
  })
}
