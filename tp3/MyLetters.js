import {CGFobject} from '../lib/CGF.js';
import { MyRectangle } from './MyRectangle.js';

export class MyLetters extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, letter, initial_x, initial_y) {
        super(scene);

        this.letter = letter;
        this.x = initial_x;
        this.y = initial_y;

        this.grid = []

        for (var i = 0; i<7; i++){
            this.x = initial_x;
            this.list = []
            for (var e = 0; e < 5; e++){
                this.list.push(
                    new MyRectangle(scene,"rect "+i+ ", "+e, this.x,this.x+0.5,this.y,this.y-0.5)
                )
                this.x += 0.5;
            }
            this.grid.push(this.list)
            this.y -= 0.5;
        }


    }
    display() {

        switch(this.letter){
            case "a":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][1].display()
                this.grid[3][2].display()
                this.grid[3][3].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;
            case "b":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][1].display()
                this.grid[3][2].display()
                this.grid[3][3].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "c":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()

                this.grid[3][0].display()

                this.grid[4][0].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "d":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "e":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()
                this.grid[0][4].display()

                this.grid[1][0].display()

                this.grid[2][0].display()

                this.grid[3][0].display()
                this.grid[3][1].display()
                this.grid[3][2].display()

                this.grid[4][0].display()

                this.grid[5][0].display()

                this.grid[6][0].display()
                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                this.grid[6][4].display()
                break;
            case "f":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()
                this.grid[0][4].display()

                this.grid[1][0].display()

                this.grid[2][0].display()

                this.grid[3][0].display()
                this.grid[3][1].display()
                this.grid[3][2].display()

                this.grid[4][0].display()

                this.grid[5][0].display()

                this.grid[6][0].display()
                break;
            case "g":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()

                this.grid[3][0].display()

                this.grid[4][0].display()
                this.grid[4][3].display()

                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "h":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][1].display()
                this.grid[3][2].display()
                this.grid[3][3].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;
            case "i":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][2].display()

                this.grid[2][2].display()

                this.grid[3][2].display()

                this.grid[4][2].display()

                this.grid[5][2].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "j":

                this.grid[0][4].display()

                this.grid[1][4].display()

                this.grid[2][4].display()


                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()

                break;
            case "k":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][3].display()

                this.grid[2][0].display()
                this.grid[2][2].display()

                this.grid[3][0].display()
                this.grid[3][1].display()

                this.grid[4][0].display()
                this.grid[4][2].display()

                this.grid[5][0].display()
                this.grid[5][3].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;

            case "l":
                this.grid[0][0].display()

                this.grid[1][0].display()

                this.grid[2][0].display()

                this.grid[3][0].display()

                this.grid[4][0].display()

                this.grid[5][0].display()

                this.grid[6][0].display()
                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                this.grid[6][4].display()
                break;
            case "m":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][1].display()
                this.grid[2][3].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][2].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;
            case "n":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][1].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][2].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][3].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;
            case "o":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "p":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][1].display()
                this.grid[3][2].display()
                this.grid[3][3].display()

                this.grid[4][0].display()

                this.grid[5][0].display()

                this.grid[6][0].display()

                break;
            case "q":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][3].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][4].display()
                break;
            case "r":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][1].display()
                this.grid[3][2].display()
                this.grid[3][3].display()

                this.grid[4][0].display()
                this.grid[4][2].display()

                this.grid[5][0].display()
                this.grid[5][3].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;
            case "s":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()

                this.grid[3][1].display()
                this.grid[3][2].display()
                this.grid[3][3].display()

                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "t":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()
                this.grid[0][4].display()

                this.grid[1][2].display()

                this.grid[2][2].display()

                this.grid[3][2].display()

                this.grid[4][2].display()

                this.grid[5][2].display()

                this.grid[6][2].display()
                break;
            case "u":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                break;
            case "v":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][4].display()

                this.grid[5][1].display()
                this.grid[5][3].display()

                this.grid[6][2].display()
                break;
            case "w":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][0].display()
                this.grid[2][4].display()

                this.grid[3][0].display()
                this.grid[3][2].display()
                this.grid[3][4].display()

                this.grid[4][0].display()
                this.grid[4][1].display()
                this.grid[4][3].display()
                this.grid[4][4].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;
            case "x":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][1].display()
                this.grid[2][3].display()

                this.grid[3][2].display()

                this.grid[4][1].display()
                this.grid[4][3].display()

                this.grid[5][0].display()
                this.grid[5][4].display()

                this.grid[6][0].display()
                this.grid[6][4].display()
                break;
            case "y":
                this.grid[0][0].display()
                this.grid[0][4].display()

                this.grid[1][0].display()
                this.grid[1][4].display()

                this.grid[2][1].display()
                this.grid[2][3].display()

                this.grid[3][2].display()

                this.grid[4][2].display()

                this.grid[5][2].display()

                this.grid[6][2].display()
                break;
            case "z":
                this.grid[0][0].display()
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()
                this.grid[0][4].display()

                this.grid[1][4].display()

                this.grid[2][3].display()

                this.grid[3][2].display()

                this.grid[4][1].display()

                this.grid[5][0].display()

                this.grid[6][0].display()
                this.grid[6][1].display()
                this.grid[6][2].display()
                this.grid[6][3].display()
                this.grid[6][4].display()
                break;
            case ".":
                this.grid[6][0].display()
                break;
            case "!":
                this.grid[0][0].display()
                this.grid[1][0].display()
                this.grid[2][0].display()
                this.grid[3][0].display()
                this.grid[4][0].display()
                this.grid[6][0].display()
                break;
            case "?":
                this.grid[0][1].display()
                this.grid[0][2].display()
                this.grid[0][3].display()
                this.grid[1][0].display()
                this.grid[1][4].display()
                this.grid[2][4].display()
                this.grid[3][3].display()
                this.grid[4][2].display()
                this.grid[6][2].display()
                break;
            default:
                throw "Invalid letter, make sure all letter are in lower case"
        }

    }
    update(number){
        this.number = number;
    }
}
