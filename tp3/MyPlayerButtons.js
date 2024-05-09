import {CGFobject} from '../lib/CGF.js';
import { MyButton } from './MyButton.js';
export class MyPlayerButtons extends CGFobject {
    constructor(scene, initial_id) {
        super(scene);
        this.initial_id = initial_id
        this.undo = new MyButton(scene,"undo",scene.blue, scene.white, this.initial_id + 2,"sprites")
        this.give_up = new MyButton(scene,"give up", scene.red,scene.white, this.initial_id + 5,"sprites")
        this.change_perspective = new MyButton(scene,"Rotate camera", scene.green,scene.white, this.initial_id + 7,"3d")
    }

    display() {

        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(-16, -5.23, 20);
        this.undo.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(2, -5.23, 20);
        this.give_up.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.translate(-19, -5.23, 28);
        this.change_perspective.display();
        this.scene.popMatrix();
      
    }

    press_undo(){
        return this.undo
    }

    press_give_up(){
        return this.give_up
    }

    press_change_perspective(){
        return this.change_perspective
    }

}
