
import {CGFobject} from '../lib/CGF.js';
import { MyPopUp } from './MyPopUp.js';
import { MyStartPopUp } from './MyStartPopUp.js';
export class MyPlayerPopUps extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene, initial_id) {
        super(scene);
        this.invalid_move = new MyPopUp(scene," Invalid Move!\n\n Please retry.",true,-0.2,initial_id,"3d")
        this.winner = new MyPopUp(scene,"    You Won!",true,-0.6,initial_id,"3d")
        this.loser = new MyPopUp(scene,"    You Lost.",true,-0.6,initial_id,"3d")
        this.time_out_p = new MyPopUp(scene,"Your time to \nmake a move \nrun out!\n\nYou Lost.",true,0.1,initial_id,"3d")
        this.time_out_loser = new MyPopUp(scene,"The game has \nrun out of time!\n\nYou Lost.",true,0,initial_id,"3d")
        this.time_out_winner = new MyPopUp(scene,"The game has \nrun out of time!\n\nYou Won!",true,0,initial_id,"3d")
        this.time_out_draw = new MyPopUp(scene,"The game has \nrun out of time!\n\nIt was a draw!",true,0,initial_id,"3d")
        this.start_pop_up = new MyStartPopUp(scene,true)

        this.open_pop_ups = []
    }

    display() {
        if (this.open_pop_ups.length != 0){
            this.open_pop_ups[this.open_pop_ups.length-1].display()
        }
    }

    show_invalid_move(){
        this.open_pop_ups.push(this.invalid_move)
    }
    

    show_winner(){
        this.open_pop_ups.push(this.winner)
    }


    show_loser(){
        this.open_pop_ups.push(this.loser)
    }


    show_time_out_p(){
        this.open_pop_ups.push(this.time_out_p)
    }

    show_start_pop_up(){
        this.open_pop_ups.push(this.start_pop_up)
    }


    show_time_out_loser(){
        this.open_pop_ups.push(this.time_out_loser)
    }


    show_time_out_winner(){
        this.open_pop_ups.push(this.time_out_winner)
    }

    show_time_out_draw(){
        this.open_pop_ups.push(this.time_out_draw)
    }


    return_close_button(){
        return this.open_pop_ups[this.open_pop_ups.length-1].close
    }

    get_pop_up(){
        return this.open_pop_ups[this.open_pop_ups.length-1]
    }


    close_pop_up(){
        this.open_pop_ups.pop()
    }

    hide_pop_up(){
        this.open_pop_ups[this.open_pop_ups.length-1].hide_pop_up()
    }

    unhide_pop_up(){
        this.open_pop_ups[this.open_pop_ups.length-1].show_pop_up()
    }

}


