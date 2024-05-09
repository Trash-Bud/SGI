import {CGFobject} from '../lib/CGF.js';
import { MyBox } from './MyBox.js';
import { MyText } from './MyText.js';
import { MyButton } from './MyButton.js';

export class MyPopUp extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene,text, show, letter_height, id,type) {
        super(scene);
        this.id = id
        this.letter_height = letter_height;
        this.window = new MyBox(scene)
        this.text_window = new MyBox(scene)
        this.show = show
        this.raw_text = text.split("\n")
        this.text = new MyText(scene, text, 0,1,type)
        this.close = new MyButton(scene, "x", scene.red, scene.white, id + 1,type)
    }

    display() {
        if (this.show){
            this.scene.black.apply()
            this.scene.pushMatrix();
            this.scene.translate(-2,1,0)
            this.scene.scale(6,3,0.2);
            this.window.display()
            this.scene.popMatrix();

            this.scene.white.apply()

            this.scene.pushMatrix();
            this.scene.translate(-1.9,1.1,0.01)
            this.scene.scale(5.8,2.8,0.2);
            this.text_window.display()
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(3.45,3.4,0)
            this.scene.rotate(90 * Math.PI /180,1,0,0)
            this.scene.scale(0.1,0.1,0.1);
            this.close.display()
            this.scene.popMatrix();

            this.scene.black.apply()
            this.scene.pushMatrix();
            this.scene.translate(-1.5,3.4 + this.letter_height,0.1)
            this.scene.scale(0.1,0.1,0.1);
            this.text.display()
            this.scene.popMatrix();
        }
    }

    show_pop_up(){
        this.show = true
    }

    hide_pop_up(){
        this.show = false
    }

}
