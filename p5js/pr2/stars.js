class Star {
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = 10;
    }

    draw() {
        fill(100, 200, 34)
        ellipse(this.x, this.y, this.r, this.r)
    }

    update(){
        const r = Math.sqrt(this.x**2 + this.y **2)
        this.x += this.x / r * this.z
        this.y += this.y / r * this.z
        this.r = map(Math.abs(this.x), 0, width/2, 3, 12) * map(this.z, 0, width/100, 0.5, 1)
        
        if (this.x >= width/2 || this.x <= -width/2){
            this.x = random(-width/8, width/8)
            this.y = random (-height/8, height/8)
            this.r = 2
        }
    }
}