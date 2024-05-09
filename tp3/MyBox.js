import {CGFobject} from '../lib/CGF.js';
import { MyRectangle } from './MyRectangle.js';

export class MyBox extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene) {
        super(scene);

        this.front = new MyRectangle(scene, "front",0,1,0,1)
        this.back = new MyRectangle(scene, "back",0,1,0,1)
        this.left = new MyRectangle(scene, "left",0,1,0,1)
        this.right = new MyRectangle(scene, "right",0,1,0,1)
        this.top = new MyRectangle(scene, "top",0,1,0,1)
        this.bottom = new MyRectangle(scene, "bottom",0,1,0,1)
    }

    display() {
        this.front.display()

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-1, 0, 1);
        this.back.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-90 * Math.PI / 180, 0, 1, 0);
        this.scene.translate(-1, 0, 0);
        this.left.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(90 * Math.PI / 180, 0, 1, 0);
        this.scene.translate(0, 0, 1);
        this.right.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(90 * Math.PI / 180, 1, 0, 0);
        this.scene.translate(0, -1, 0);
        this.bottom.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-90 * Math.PI / 180, 1, 0, 0);
        this.scene.translate(0, 0, 1);
        this.top.display();
        this.scene.popMatrix();
    }


}
