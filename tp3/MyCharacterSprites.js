import {CGFobject} from '../lib/CGF.js';
import { MyRectangle } from './MyRectangle.js';

export class MyCharacterSprites extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, letter, initial_x, initial_y) {
        super(scene);

        this.letter = letter;
        this.background = new MyRectangle(scene,"rec",initial_x,initial_x+2.5,initial_y,initial_y+4)


    }
    display() {

        this.scene.setActiveShaderSimple(this.scene.textShader);
        this.scene.font.apply()

        switch(this.letter){
            case "a":
                this.scene.activeShader.setUniformsValues({'charCoords': [1,4]});	
			    this.background.display();
                break;
            case "b":
                this.scene.activeShader.setUniformsValues({'charCoords': [2,4]});	
			    this.background.display();
                break;
            case "c":
                this.scene.activeShader.setUniformsValues({'charCoords': [3,4]});	
			    this.background.display();
                break;
            case "d":
                this.scene.activeShader.setUniformsValues({'charCoords': [4,4]});	
			    this.background.display();
                break;
            case "e":
                this.scene.activeShader.setUniformsValues({'charCoords': [5,4]});	
			    this.background.display();
                break;
            case "f":
                this.scene.activeShader.setUniformsValues({'charCoords': [6,4]});	
			    this.background.display();
                break;
            case "g":
                this.scene.activeShader.setUniformsValues({'charCoords': [7,4]});	
			    this.background.display();
                break;
            case "h":
                this.scene.activeShader.setUniformsValues({'charCoords': [8,4]});	
			    this.background.display();
                break;
            case "i":
                this.scene.activeShader.setUniformsValues({'charCoords': [9,4]});	
			    this.background.display();
                break;
            case "j":
                this.scene.activeShader.setUniformsValues({'charCoords': [10,4]});	
			    this.background.display();
                break;
            case "k":
                this.scene.activeShader.setUniformsValues({'charCoords': [11,4]});	
			    this.background.display();
                break;

            case "l":
                this.scene.activeShader.setUniformsValues({'charCoords': [12,4]});	
			    this.background.display();
                break;
            case "m":
                this.scene.activeShader.setUniformsValues({'charCoords': [13,4]});	
			    this.background.display();
                break;
            case "n":
                this.scene.activeShader.setUniformsValues({'charCoords': [14,4]});	
			    this.background.display();
                break;
            case "o":
                this.scene.activeShader.setUniformsValues({'charCoords': [15,4]});	
			    this.background.display();
                break;
            case "p":
                this.scene.activeShader.setUniformsValues({'charCoords': [0,5]});	
			    this.background.display();

                break;
            case "q":
                this.scene.activeShader.setUniformsValues({'charCoords': [1,5]});	
			    this.background.display();
                break;
            case "r":
                this.scene.activeShader.setUniformsValues({'charCoords': [2,5]});	
			    this.background.display();
                break;
            case "s":
                this.scene.activeShader.setUniformsValues({'charCoords': [3,5]});	
			    this.background.display();
                break;
            case "t":
                this.scene.activeShader.setUniformsValues({'charCoords': [4,5]});	
			    this.background.display();
                break;
            case "u":
                this.scene.activeShader.setUniformsValues({'charCoords': [5,5]});	
			    this.background.display();
                break;
            case "v":
                this.scene.activeShader.setUniformsValues({'charCoords': [6,5]});	
			    this.background.display();
                break;
            case "w":
                this.scene.activeShader.setUniformsValues({'charCoords': [7,5]});	
			    this.background.display();
                break;
            case "x":
                this.scene.activeShader.setUniformsValues({'charCoords': [8,5]});	
			    this.background.display();
                break;
            case "y":
                this.scene.activeShader.setUniformsValues({'charCoords': [9,5]});	
			    this.background.display();
                break;
            case "z":
                this.scene.activeShader.setUniformsValues({'charCoords': [10,5]});	
			    this.background.display();
                break;
            case ".":
                this.scene.activeShader.setUniformsValues({'charCoords': [14,2]});	
			    this.background.display();
                break;
            case "!":
                this.scene.activeShader.setUniformsValues({'charCoords': [1,2]});	
			    this.background.display();
                break;
            case "?":
                this.scene.activeShader.setUniformsValues({'charCoords': [15,3]});	
			    this.background.display();
                break;
            case "0":
                this.scene.activeShader.setUniformsValues({'charCoords': [0,3]});	
			    this.background.display();
                break;
            case "1":
                this.scene.activeShader.setUniformsValues({'charCoords': [1,3]});	
			    this.background.display();
                break;
            case "2":
                this.scene.activeShader.setUniformsValues({'charCoords': [2,3]});	
			    this.background.display();
                break;
            case "3":
                this.scene.activeShader.setUniformsValues({'charCoords': [3,3]});	
			    this.background.display();
                break;
            case "4":
                this.scene.activeShader.setUniformsValues({'charCoords': [4,3]});	
			    this.background.display();
                break;
            case "5":
                this.scene.activeShader.setUniformsValues({'charCoords': [5,3]});	
			    this.background.display();
                break;
            case "6":
                this.scene.activeShader.setUniformsValues({'charCoords': [6,3]});	
			    this.background.display();
                break;
            case "7":
                this.scene.activeShader.setUniformsValues({'charCoords': [7,3]});	
			    this.background.display();
                break;
            case "8":
                this.scene.activeShader.setUniformsValues({'charCoords': [8,3]});	
			    this.background.display();
                break;
            case "9":
                this.scene.activeShader.setUniformsValues({'charCoords': [9,3]});	
			    this.background.display();
                break;
            default:
                throw "Invalid character, make sure all letter are in lower case"
        }

        this.scene.setActiveShaderSimple(this.scene.defaultShader);

    }
    update(number){
        this.number = number;
    }
}
