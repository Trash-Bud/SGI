import {CGFobject} from '../lib/CGF.js';
import { MyBox } from './MyBox.js';
import { MyText } from './MyText.js';
import { MyButton } from './MyButton.js';

export class MyStartPopUp extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, show) {
        super(scene);
        this.window = new MyBox(scene)
        this.text_window = new MyBox(scene)
        this.show = show

        this.text1 = new MyText(scene, "Start the game?", 0,1,"3d")

        this.text2 = new MyText(scene, "Change scenery?", 0,0,"3d")

        this.start = new MyButton(scene, "start", scene.blue,scene.white,98,"3d")
        this.change = new MyButton(scene, "change", scene.green,scene.white,100,"3d")
    }

    display() {
        if (this.show){
            this.scene.red.apply()
            this.scene.pushMatrix();
            this.scene.translate(-2,1,0)
            this.scene.scale(6,3.7,0.2);
            this.window.display()
            this.scene.popMatrix();

            this.scene.white.apply()

            this.scene.pushMatrix();
            this.scene.translate(-1.9,1.1,0.01)
            this.scene.scale(5.8,3.5,0.2);
            this.text_window.display()
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(-0.2,3.2,0)
            this.scene.rotate(90 * Math.PI /180,1,0,0)
            this.scene.scale(0.12,0.12,0.12);
            this.start.display()
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(-0.4,1.4,0)
            this.scene.rotate(90 * Math.PI /180,1,0,0)
            this.scene.scale(0.12,0.12,0.12);
            this.change.display()
            this.scene.popMatrix();

            this.scene.black.apply()
            this.scene.pushMatrix();
            this.scene.translate(-1.5,4.2 ,0.1)
            this.scene.scale(0.1,0.1,0.1);
            this.text1.display()
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(-1.5,2.5,0.1)
            this.scene.scale(0.1,0.1,0.1);
            this.text2.display()
            this.scene.popMatrix();
        }
    }


    get_change_button(){
        return this.change
    }

    get_start_button(){
        return this.start
    }

    change_scenery(){
        console.log("change scenery")
    }

    show_pop_up(){
        this.show = true
    }

    hide_pop_up(){
        this.show = false
    }

    start_game(my_start_pop_up){
        console.log("start")
        my_start_pop_up.show = false
    }

}
