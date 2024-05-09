import {CGFobject} from '../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';
import { MyRectangle } from './MyRectangle.js';

export class MyRectangleWithEnds extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, x1,x2,y1,y2) {
        super(scene);

        if (x2 < x1){
            throw "x2 must be bigger then x1";
        }
        if (x2 < x1){
            throw "x2 must be bigger then x1";
        }

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.rectangle = new MyRectangle(scene,"rect",x1,x2,y1,y2);

        if (Math.abs(x2-x1) > Math.abs(y2-y1)){ // horizontal
            this.triangle1 = new MyTriangle(this.scene, "tri1", x1,x1-0.25,x1,y2,(y1+y2)/2,y1,0,0,0)
            this.triangle2 = new MyTriangle(this.scene, "tri2", x2,x2+0.25,x2,y1,(y1+y2)/2,y2,0,0,0)
        }else{ //vertical
            this.triangle1 = new MyTriangle(this.scene, "tri1", x1,(x1+x2)/2,x2,y1,y1-0.25,y1,0,0,0)
            this.triangle2 = new MyTriangle(this.scene, "tri2", x2,(x1+x2)/2,x1,y2,y2+0.25,y2,0,0,0)
        }

    }
    display() {
        this.rectangle.display();
        this.triangle1.display();
        this.triangle2.display();
    }
}
