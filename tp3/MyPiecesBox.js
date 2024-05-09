import {CGFobject} from '../lib/CGF.js';
import { MyOpenBox } from './MyOpenBox.js';
import { MyPiece } from './MyPiece.js';

export class MyPiecesBox extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, position) {
        super(scene);

        this.position = position
        this.box = new MyOpenBox(scene)

        this.pieces = []

        this.initial_x = position[0] + 0.15
        this.initial_y = position[2] - 2.9
        this.initial_z = position[1] + 0.8

        this.increment = 0.85
        this.z_increment = 0.25
    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(...this.position)
        this.box.display()
        this.scene.popMatrix();

        for (var i = 0 ; i < this.pieces.length;i ++){
            if(this.pieces[i].isAnimating){
                continue
            }
            else{
                var pos = this.getPosByIndex(i);

                this.scene.pushMatrix();
                this.scene.rotate(90*Math.PI/180,1,0,0)
                this.scene.translate(pos[0],pos[1],pos[2])
                this.pieces[i].display()
                this.scene.popMatrix();
            }   
        }

    }

    getPosByIndex(i){
        var x = this.initial_x + this.increment * (i % 3)
        var y = this.initial_y + this.increment * (Math.trunc(i/3) % 3)
        var z = this.initial_z - this.z_increment * Math.trunc(i/9)

        return [x,y,z]
    }

    getLastPos(){
        var pos = this.getPosByIndex(this.pieces.length-1)
        return pos
    }

    add_piece(piece){
        this.pieces.push(piece)
        return this.getLastPos()
    }

    remove_piece(){
        if (this.pieces.length == 0){
            throw "Box is empty"
        }
       
        var piece = this.pieces.pop()
        return piece
    }

    empty(){
        return this.pieces.length == 0
    }

    remove_all_piece(){

        this.pieces = []
    }

}
