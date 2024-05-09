import { CGFobject} from '../lib/CGF.js';
import { MyBox } from './MyBox.js';
import { MyTwoDigitNumbers } from './MyTwoDigitNumbers.js';


export class MyScoreBox extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene) {
        super(scene);
      
        this.p1_score = 0
        this.p2_score = 0
        this.score_box = new MyBox(scene)
        this.p1_frame = new MyBox(scene)
        this.p2_frame = new MyBox(scene)
        this.p1_viz_score = new MyTwoDigitNumbers(scene,this.p1_score)
        this.p2_viz_score = new MyTwoDigitNumbers(scene,this.p1_score)
    }

    display() {
        
        this.scene.white.apply()

        this.scene.pushMatrix();
        this.scene.translate(7.5,-1.2,0)
        this.scene.scale(1,2,5)
        this.score_box.display();
        this.scene.popMatrix();

        this.scene.black.apply()

        this.scene.pushMatrix();
        this.scene.translate(7.4,-0.9,-0.2)
        this.scene.scale(0.1,1.5,2)
        this.p1_frame.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(7.4,-0.9,-2.7)
        this.scene.scale(0.1,1.5,2)
        this.p2_frame.display();
        this.scene.popMatrix();


        this.scene.white.apply()

        this.scene.pushMatrix();
        this.scene.translate(7.39,-1,-1.46)
        this.scene.rotate(-90* Math.PI/180,0,1,0)
        this.scene.scale(0.35,0.35,0.35)
        this.p1_viz_score.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(7.39,-1,-4)
        this.scene.rotate(-90* Math.PI/180,0,1,0)
        this.scene.scale(0.35,0.35,0.35)
        this.p2_viz_score.display();
        this.scene.popMatrix();

    }

    update_p1_score(number){
        this.p1_viz_score.update(number)
        this.p1_score = number
    }

    increment_p1_score(){
        this.p1_viz_score.update(this.p1_score + 1)
        this.p1_score += 1
    }

    decrement_p1_score(){
        this.p1_viz_score.update(this.p1_score - 1)
        this.p1_score -= 1
    }

    update_p2_score(number){
        this.p2_viz_score.update(number)
        this.p2_score = number
    }

    increment_p2_score(){
        this.p2_viz_score.update(this.p2_score + 1)
        this.p2_score += 1
    }

    decrement_p2_score(){
        this.p2_viz_score.update(this.p2_score - 1)
        this.p2_score -= 1
    }

    reset(){
        this.p2_score = 0
        this.p1_score = 0
        this.p2_viz_score.update(this.p2_score)
        this.p1_viz_score.update(this.p1_score)
    }

    getLead(){
        if (this.p1_score > this.p2_score){
            return "white"
        }else if (this.p1_score < this.p2_score){
            return "black"
        }else{
            return "none"
        }
    }
   
}
