import {CGFobject} from '../lib/CGF.js';
import { MyLetters } from './MyLetters.js';
import {MyCharacterSprites} from './MyCharacterSprites.js'
export class MyText extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, text, initial_x, y, letter_type) {
        super(scene);
        this.text = text.toLowerCase();
        this.sentence = [];

        if (letter_type == "3d"){
            this.y = y;
        }else if (letter_type == "sprites"){
            this.y = y - 4;
        }else{
            throw "Invalid letter type in:" + text
        }

        this.x = initial_x;

        for (var i = 0; i < this.text.length; i++){
            if (this.text[i].match(/[a-z]/i)){
                if (letter_type == "3d") this.sentence.push(new MyLetters(scene,this.text[i],this.x,this.y))
                if (letter_type == "sprites") this.sentence.push(new MyCharacterSprites(scene,this.text[i],this.x,this.y))
                this.x += 0.5
            }else if (this.text[i] == "." || this.text[i] == "!" || this.text[i] == "?") {
                if (letter_type == "3d") this.sentence.push(new MyLetters(scene,this.text[i],this.x,this.y))
                if (letter_type == "sprites") this.sentence.push(new MyCharacterSprites(scene,this.text[i],this.x,this.y))
            }else if(this.text[i] == "\n"){
                this.y -= 9*0.5
                this.x = initial_x
                continue;
            }
            this.x += 5 * 0.5 + 0.5
        }
        
    }

    getWidth() {
        return this.x
    }

    display() {
        
        for (var i = 0; i < this.sentence.length; i++){
            this.sentence[i].display()
        }
    }


}
