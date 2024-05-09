import { CGFobject} from '../lib/CGF.js';
import { MyPiecesBox } from './MyPiecesBox.js';
import { MyScoreBox } from "./MyScoreBoard.js";

export class MyExtras extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
    constructor(scene) {
        super(scene);
        this.p1_piece_box = new MyPiecesBox(scene,[6,0,6])
        this.p2_piece_box = new MyPiecesBox(scene,[6,0,-6])
        this.score_box = new MyScoreBox(scene)

    }

    display() {
        
        this.p1_piece_box.display()
    
        this.p2_piece_box.display();
       

        this.score_box.display();

    }

    remove_piece_player1(){
        this.score_box.decrement_p1_score()
        return this.p1_piece_box.remove_piece()
    }

    add_piece_player1(piece){
        this.score_box.increment_p1_score()
        return this.p1_piece_box.add_piece(piece)
    }

    remove_piece_player2(){
        this.score_box.decrement_p2_score()
        return this.p2_piece_box.remove_piece()
    }

    add_piece_player2(piece){
        this.score_box.increment_p2_score()
        return this.p2_piece_box.add_piece(piece)
    }

    get_last_pos_p1(){
        return this.p1_piece_box.getPosByIndex()
    }

    get_last_pos_p2(){
        return this.p2_piece_box.getPosByIndex()
    }

    empty_p1(){
        return this.p1_piece_box.empty()
    }

    empty_p2(){
        return this.p2_piece_box.empty()
    }

    reset(){
        this.p1_piece_box.remove_all_piece()
        this.p2_piece_box.remove_all_piece()
        this.score_box.reset()
    }

    getLead(){
        return this.score_box.getLead()
    }

   
}
