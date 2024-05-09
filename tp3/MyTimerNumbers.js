import {CGFobject} from '../lib/CGF.js';
import { MyTwoDigitNumbers } from './MyTwoDigitNumbers.js';
import { MyRectangle } from './MyRectangle.js';

export class MyTimerNumbers extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, minutes,seconds) {
        super(scene);

        this.minutes = minutes;
        this.seconds = seconds;
        this.validate();

        this.minutes_model = new MyTwoDigitNumbers(this.scene,this.minutes);
        this.seconds_model = new MyTwoDigitNumbers(this.scene,this.seconds);
        this.middle_top = new MyRectangle(scene,"rect",3.6,4.1,3,3.5);
        this.middle_bottom = new MyRectangle(scene,"rect",3.6,4.1,1.5,2);
    }

    validate(){
        if (this.minutes > 59 || this.minutes < 0){
            throw "Invalid minutes"
        }
        if (this.seconds > 59 || this.seconds < 0){
            throw "Invalid seconds"
        }

    }

    display() {
        this.minutes_model.display();

        this.middle_top.display();
        this.middle_bottom.display();

        this.scene.pushMatrix();
        this.scene.translate(6,0,0);
        this.seconds_model.display();
        this.scene.popMatrix();
    }

    update(minutes, seconds){
        this.minutes = minutes;
        this.seconds = seconds;

        this.minutes_model.update(this.minutes)
        this.seconds_model.update(this.seconds)

        this.validate();
    }
}
