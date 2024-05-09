import { CGFobject} from '../lib/CGF.js';
import { MyTimerNumbers } from './MyTimerNumbers.js';
import { MyBox } from './MyBox.js';

export class MyTimer extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, max_min, max_sec, max_total_min, max_total_sec) {
        super(scene);
        
        this.max_min = max_min;
        this.max_sec = max_sec;

        this.max_total_min = max_total_min;
        this.max_total_sec = max_total_sec;

        this.game_min = max_total_min;
        this.game_sec = max_total_sec;

        this.box = new MyBox(this.scene);
        this.small_box = new MyBox(this.scene);


        this.p1_minutes = max_min;
        this.p1_seconds = max_sec;
        this.p2_minutes = max_min;
        this.p2_seconds = max_sec;

        this.p1_counter = new MyTimerNumbers(this.scene,this.p1_minutes,this.p1_seconds)
        this.p2_counter = new MyTimerNumbers(this.scene,this.p2_minutes,this.p2_seconds)
        this.total_time_counter = new MyTimerNumbers(this.scene,this.game_min,this.game_sec)

    }

    display(player) {

        this.scene.white.apply()

        if (player == "white") {
            if (this.p1_seconds < 10 && this.p1_minutes == 0){
                this.scene.red.apply()
            }
            else this.scene.green.apply()
        }
        this.scene.pushMatrix();
        this.scene.scale(0.2,0.2,0.2);
        this.scene.translate(4,1.5,0.1)
        this.p1_counter.display();
        this.scene.popMatrix();

        this.scene.white.apply()

        if (player == "black") {
            if (this.p2_seconds < 10 && this.p2_minutes == 0){
                this.scene.red.apply()
            }
            else this.scene.green.apply()
        }

        this.scene.pushMatrix();
        this.scene.scale(0.2,0.2,0.2);
        this.scene.translate(19,1.5,0.1)
        this.p2_counter.display();
        this.scene.popMatrix();

        this.scene.white.apply()

        this.scene.pushMatrix();
        this.scene.scale(2.5,1,1);
        this.scene.translate(0.7,1.7,0)
        this.small_box.display();
        this.scene.popMatrix();

        this.scene.black.apply()

        this.scene.pushMatrix();
        this.scene.scale(6,1.7,1);
        this.box.display();
        this.scene.popMatrix();

        if (this.game_sec < 10 && this.game_min == 0){
            this.scene.red.apply()
        }
        this.scene.pushMatrix();
        this.scene.scale(0.2,0.2,0.2);
        this.scene.translate(11,8.5,0.1)
        this.total_time_counter.display();
        this.scene.popMatrix();
    }

    update_player_time(player){
        if (player == "black"){
            if (this.p2_seconds == 0){
                this.p2_minutes -= 1;
                this.p2_seconds = 59;
            }
            else{
                this.p2_seconds  -= 1;
            }

            this.p2_counter.update(this.p2_minutes,this.p2_seconds)

            if (this.p2_minutes == 0 && this.p2_seconds == 0){
                return true;
            }

        }else if (player == "white"){
            if (this.p1_seconds == 0){
                this.p1_minutes -= 1;
                this.p1_seconds = 59;
            }
            else{
                this.p1_seconds -= 1;
            }     

            this.p1_counter.update(this.p1_minutes,this.p1_seconds)
            
            if (this.p1_minutes == 0  && this.p1_seconds == 0){
                return true;
            }
        }else{
            throw "Invalid player"
        }
        return false
    }

    update_total_time(){
        if (this.game_sec == 0){
            this.game_min -= 1;
            this.game_sec = 59;
        }
        else{
            this.game_sec -= 1;
        }

        this.total_time_counter.update(this.game_min,this.game_sec)

        if (this.game_min == 0 && this.game_sec == 0){        
            return true;
        }
       
        return false
    }

    reset_total_time(){
        this.game_min = this.max_total_min;
        this.game_sec = this.max_total_sec;

        this.total_time_counter.update(this.game_min,this.game_sec)
    }


    reset_player(player){
        if (player == "black"){
            this.p2_minutes = this.max_min;
            this.p2_seconds = this.max_sec;

            this.p2_counter.update(this.p2_minutes,this.p2_seconds)
        }else if (player == "white"){
            this.p1_minutes = this.max_min;
            this.p1_seconds = this.max_sec;     
            
            this.p1_counter.update(this.p1_minutes,this.p1_seconds)
        }else{
            throw "Invalid player"
        }
    }

    reset(){
        this.reset_player("white")
        this.reset_player("black")
        this.reset_total_time()
    }
}
