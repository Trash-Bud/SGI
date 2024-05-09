import { MyRectangle } from "./MyRectangle.js"



export class MyTile{
    constructor(board_coords,scene, color){
        this.scene = scene
        this.pickedColor = this.scene.green

        this.highlightColor = this.scene.red
        this.color = color
        if (color == 'white'){
            this.colorMaterial = this.scene.white
        }else if(color == 'black'){
            this.colorMaterial = this.scene.black
        }

        this.board_coords = board_coords
    
    
        this.piece = undefined

        this.pickable = false
        this.highlighted = false
        this.picked = false
        this.myTile = new MyRectangle(this.scene, this.board_coords[0] * 10 + this.board_coords[1],0,1,0,1);
    }

    getCoords(){
        return this.board_coords
    }
    getColor(){
        return this.color
    }
    setPicked(){
        this.picked = true
    }
    
    unsetPicked(){
        this.picked = false
    }
    
    setPiece(piece){
        this.piece = piece
    }
    registerForPicking(){
        this.pickable = true
    }
    unregisterForPicking(){
        this.pickable = false
    }
    
    hasPiece(){
        return this.piece != undefined
    }

    setHighlighted(){
        this.highlighted = true
    }

    unsetHighlighted(){
        this.highlighted = false
    }

    getPiece(){
        return this.piece
    }
    getRealTilePosition(coords_x, coords_y){
        const coordsMap = {'0': 2, '1': 1, '2': 0, '3': -1, '4': -2, '5': -3, '6': -4, '7': -5}
        return [coords_y - 3,-( coordsMap[coords_x.toString()]), -1]
    }

    display(){

        
        const x = this.board_coords[0]
        const y = this.board_coords[1]

        if (this.picked){
            this.scene.pickedColor.apply()
        }else if(this.highlighted){
            this.scene.highlightColor.apply()
        }
        else{
             this.colorMaterial.apply()
        }
       
        this.scene.pushMatrix()
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.translate(...this.getRealTilePosition(x,y))
       
        
        
        if (this.pickable){
            this.scene.registerForPick(this.board_coords[0] * 10 + this.board_coords[1] + 1, this.myTile )
        }else{
            this.scene.registerForPick(-1, this.myTile )
        }
        
        this.myTile.display()
        
        if (this.piece && !this.piece.isAnimating){
            this.scene.pushMatrix()
            this.scene.translate(0.5,0.5,0.1)
            this.piece.display()
            if(this.piece.isKing){
                this.scene.pushMatrix()
                this.scene.translate(0,0,0.25)
                this.piece.display()
                this.scene.popMatrix()
            }
            this.scene.popMatrix()
        }

        this.scene.popMatrix()
    }
}