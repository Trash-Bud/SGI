import {CGFobject} from '../lib/CGF.js';
import { MyBox } from './MyBox.js';

export class MyOpenBox extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene) {
        super(scene);

        this.bottom = new MyBox(scene)
        this.left = new MyBox(scene)
        this.right = new MyBox(scene)
        this.front = new MyBox(scene)
        this.back = new MyBox(scene)

    }

    display() {

        this.scene.brown.apply()
        
        this.scene.pushMatrix();
        this.scene.translate(-0.25,-1.1,-0.7)
        this.scene.scale(2.5,0.1,2.6);
        this.bottom.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.25,-1.1,-0.7)
        this.scene.scale(2.5,0.5,0.1);
        this.front.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.25,-1.1,-0.7)
        this.scene.rotate(90*Math.PI/180,0,1,0)
        this.scene.translate(0,0,2.6)
        this.scene.scale(2.6,0.5,0.1);
        this.right.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.25,-1.1,-0.7)
        this.scene.rotate(90*Math.PI/180,0,1,0)
        this.scene.scale(2.6,0.5,0.1);
        this.left.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.25,-1.1,-0.7)
        this.scene.translate(-0.1,0,-2.6);
        this.scene.scale(2.7,0.5,0.1);
        this.back.display();
        this.scene.popMatrix();
    }
}
