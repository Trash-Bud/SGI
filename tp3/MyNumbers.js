import {CGFobject} from '../lib/CGF.js';
import { MyRectangleWithEnds } from './MyRectangleWithEnds.js';

export class MyNumbers extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, number) {
        super(scene);

        this.number = number;

        this.ver_right_top = new MyRectangleWithEnds(scene,0.1,0.6,2.7,3.8);
        this.ver_right_bottom = new MyRectangleWithEnds(scene,0.1,0.6,1.1,2.2);

        this.ver_left_top = new MyRectangleWithEnds(scene,-1.5,-1,2.7,3.8);
        this.ver_left_bottom = new MyRectangleWithEnds(scene,-1.5,-1,1.1,2.2);

        this.hor_top = new MyRectangleWithEnds(scene,-1,0.1,3.8,4.3);
        this.hor_bottom = new MyRectangleWithEnds(scene,-1,0.1,0.6,1.1);
        this.hor_middle = new MyRectangleWithEnds(scene,-1,0.1,2.2,2.7);
    }
    display() {

        switch(this.number){
            case 0:
                this.ver_right_top.display();
                this.ver_right_bottom.display();
                this.ver_left_top.display();
                this.ver_left_bottom.display();
                this.hor_top.display();
                this.hor_bottom.display();
                break;
            case 1:
                this.ver_right_top.display();
                this.ver_right_bottom.display();
                break;
            case 2:
                this.ver_right_top.display();
                this.ver_left_bottom.display();
                this.hor_top.display();
                this.hor_bottom.display();
                this.hor_middle.display();
                break;
            case 3:
                this.ver_right_top.display();
                this.ver_right_bottom.display();
                this.hor_top.display();
                this.hor_bottom.display();
                this.hor_middle.display();
                break;
            case 4:
                this.ver_right_top.display();
                this.ver_left_top.display();
                this.ver_right_bottom.display();
                this.hor_middle.display();
                break;
            case 5:
                this.ver_left_top.display();
                this.ver_right_bottom.display();
                this.hor_top.display();
                this.hor_bottom.display();
                this.hor_middle.display();
                break;
            case 6:
                this.ver_left_top.display();
                this.ver_left_bottom.display();
                this.ver_right_bottom.display();
                this.hor_top.display();
                this.hor_bottom.display();
                this.hor_middle.display();
                break;
            case 7:
                this.ver_right_top.display();
                this.ver_right_bottom.display();
                this.hor_top.display();
                break;
            case 8:
                this.ver_right_top.display();
                this.ver_right_bottom.display();
                this.ver_left_top.display();
                this.ver_left_bottom.display();
                this.hor_top.display();
                this.hor_bottom.display();
                this.hor_middle.display();
                break;
            case 9:
                this.ver_left_top.display();
                this.ver_right_top.display();
                this.ver_right_bottom.display();
                this.hor_top.display();
                this.hor_middle.display();
                break;
            default:
                throw "Number must be between 0 and 9"
        }

    }
    update(number){
        this.number = number;
    }
}
