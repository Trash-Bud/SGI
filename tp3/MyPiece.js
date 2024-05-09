import { MyPatch } from "./MyPatch.js"

export class MyPiece {
    constructor(type, scene, color, isKing){
        this.type = type
        this.scene = scene
        this.color = color
        this.isKing = isKing
        this.isAnimating = false
        this.colorMaterial = this.scene.white
        if (color == 'white'){
            this.colorMaterial = this.scene.white
        }else if(color == 'black'){
            this.colorMaterial = this.scene.black
        }
        
        var control_points = [
            [1,0,-0.3],
            [1,0,0.3],
            [1,1.33,-0.3],
            [1,1.33,0.3],
            [-1,1.33,-0.3],
            [-1,1.33,0.3],
            [-1,0,-0.3],
            [-1,0,0.3]

        ]
        var degree_u = 3
        var degree_v = 1
        var parts_u = 40
        var parts_v = 2
        this.myBarrel = new MyPatch(this.scene, degree_u,degree_v,parts_u,parts_v,control_points )


        var control_points_circle = [
            [1,0,0],
            [1,0,0],
            [-1,0,0],
            [-1,0,0],
            [1,0,0],
            [1,1.33,0],
            [-1,1.33,0],
            [-1,0,0]
        ]
        var degree_u = 1
        var degree_v = 3
        var parts_u = 40
        var parts_v = 40
        this.halfCircle = new MyPatch(this.scene,degree_u,degree_v,parts_u,parts_v,control_points_circle )

    }

    makeKing(){
        this.isKing = true
    }

    unmakeKing(){
        this.isKing = false
    }

    becomeAnimated(){
        this.isAnimating = true
    }

    becomeStatic(){
        this.isAnimating = false
    }

    getColor(){
        return this.color
    }

    king(){
        return this.isKing
    }

    display(){
    
        this.colorMaterial.apply()
        this.scene.pushMatrix()

        this.scene.scale(0.4,0.4,0.4)
    
        
        // top circle
        this.scene.pushMatrix()

        this.scene.translate(0,0,0.3)
        this.halfCircle.display()

        this.scene.rotate(Math.PI, 0,0,1)
        this.halfCircle.display()

        this.scene.popMatrix()
        
        // bottom circle
        this.scene.pushMatrix()

        this.scene.translate(0,0,-0.3)
        this.scene.rotate(Math.PI, 1,0,0)
        this.halfCircle.display()

        this.scene.rotate(Math.PI, 0,0,1)
        this.halfCircle.display()

        this.scene.popMatrix()

        
        // body part

        this.scene.pushMatrix()
        this.scene.rotate(Math.PI, 1,0,0)
        this.myBarrel.display()

        this.scene.popMatrix()
    
        this.myBarrel.display()
        

        this.scene.popMatrix()
    }
  }