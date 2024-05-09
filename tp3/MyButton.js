import {CGFobject,} from '../lib/CGF.js';
import { MyBox } from './MyBox.js';
import { MyText } from './MyText.js';
export class MyButton extends CGFobject {
    constructor(scene, text, color, letter_color, id,type, selected_color) {
        super(scene);
        this.id = id;
        this.color = color
        this.current_color = color
        this.selected_color = selected_color
        this.letter_color = letter_color
        this.text = new MyText(scene,text, 0, 1, type)
        this.box = new MyBox(scene)
        this.bottom = new MyBox(scene)
        this.height = 2;
    }

    display() {

        this.current_color.apply()

        this.scene.pushMatrix();
        this.scene.scale(this.text.getWidth() + 0.5, this.height, 9*0.5);
        this.scene.registerForPick(this.id, this.box )
        this.box.display();
        this.scene.popMatrix();
        
        this.scene.white.apply();

        this.scene.pushMatrix();
        this.scene.translate(-0.5,0.1,0.5)
        this.scene.scale(this.text.getWidth() + 1.5,1, 9*0.5 + 1);

       
        this.box.display();
        this.scene.popMatrix();


        if (this.letter_color != null)  this.letter_color.apply()

        this.scene.pushMatrix();
        this.scene.rotate(-90 * Math.PI/180,1,0,0)
        this.scene.translate(0.75,3,this.height + 0.1)
        this.text.display();
        this.scene.popMatrix();
      
    }

    press(){
        this.current_color = this.selected_color ?? this.scene.white
    }

    stop_press(){
        this.current_color = this.color
    }

}
