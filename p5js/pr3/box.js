class Box {
    constructor(pVector, fillFlag = false){
        this.pVector = pVector
        this.fillFlag = fillFlag
    }

    show() {
        const {x,y,z, len, r,g,b} = this.pVector
        translate(x,y,z)
        
        if(this.fillFlag){
            stroke(r,g,b)
            fill(r,g,b)
        }else{
            noFill()
            stroke(r,g,b)
        }
        // noFill()
        // 
        
        box(len)

        translate(-x,-y,-z)
    }
}