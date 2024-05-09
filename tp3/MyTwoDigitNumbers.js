import {CGFobject} from '../lib/CGF.js';
import { MyNumbers } from './MyNumbers.js';

export class MyTwoDigitNumbers extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, number) {
        super(scene);

        this.number = number;
        this.validate();

        if (this.number < 10){
            this.left_number = new MyNumbers(this.scene,0);
            this.right_number = new MyNumbers(this.scene,parseInt(String(this.number)[0]));

        }else{
            this.left_number = new MyNumbers(this.scene,parseInt(String(this.number)[0]));
            this.right_number = new MyNumbers(this.scene,parseInt(String(this.number)[1]));
        }
        
    }

    validate(){
        if (this.number > 99){
            throw "Number must be two digits"
        }

        if (this.number < 0){
            throw "Number must be positive"
        }
    }

    display() {




        this.left_number.display();

        this.scene.pushMatrix();
        this.scene.translate(2.5,0,0);
        this.right_number.display();
        this.scene.popMatrix();
    }
    update(number){
        this.number = number;
        this.validate();

        if (this.number < 10){
            this.left_number.update(0);
            this.right_number.update(parseInt(String(this.number)[0]));
        }else{
            this.left_number.update(parseInt(String(this.number)[0]));
            this.right_number.update(parseInt(String(this.number)[1]));
        }
    }
}
