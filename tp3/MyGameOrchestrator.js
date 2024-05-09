import { MyAnimator } from "./MyAnimator.js"
import { MyGameBoard } from "./MyGameBoard.js"
import { MyTimer } from "./MyTimer.js"
import { MyPlayerButtons } from "./MyPlayerButtons.js"
import { MyButton } from './MyButton.js';
import { MyPlayerPopUps } from './MyPlayerPopUps.js';
import { MyCameraAnimation } from "./MyCameraAnimation.js";
import { MyReplayer } from "./MyReplayer.js";
import { MyButtonAnimation } from "./MyButtonAnimation.js";




export class MyGameOrchestrator{

    constructor(scene){
        this.scene = scene
   
        this.playerScore = {'white': 0, 'black': 0}
        this.currentPlayer = 'white'
        this.animator = new MyAnimator(this.scene,this,this.gameSequence)
        this.gameBoard = new MyGameBoard(this.scene)
        this.timer = new MyTimer(this.scene,5,0,15,0)
        this.theme = undefined
        this.allValidMoves = this.gameBoard.getValidMoves(this.currentPlayer)
        this.gameRunning = false
        this.player1_buttons = new MyPlayerButtons(scene,80)
        this.player2_buttons = new MyPlayerButtons(scene,90)
        this.show_replay = new MyButton(scene,"Show Replay",scene.black,scene.white, 89,"3d")
        
        this.show_replay_board = null

        this.p1_pop_ups = new MyPlayerPopUps(scene,101)
        this.p2_pop_ups = new MyPlayerPopUps(scene,103)
        this.p1_pop_ups.show_start_pop_up()

        this.showingReplay = false;

        this.buttons_map = {
            81 : this.pressUndo,
            84: this.giveUpP1,
            86: this.rotate_camera,
            88: this.showReplay,
            91 : this.pressUndo, 
            94: this.giveUpP2,
            96: this.rotate_camera,
            97: this.restartGame,
            99: this.changeScenery, 
            101: this.close_pop_ups,
            103: this.close_pop_ups,
         }
        
        
    }

    close_pop_ups(scene,player, time){
        var button = player.return_close_button()
        console.log(button)
        scene.buttons_animator = new MyButtonAnimation(scene,button,time,50)

        player.close_pop_up()
    }

    rotate_camera(scene,player,time){
      
        var button = player.press_change_perspective()

        scene.buttons_animator = new MyButtonAnimation(scene,button,time,50)

        var initialCamera = scene.camera
        var finalCamera = undefined
        if(scene.camera == scene.cameras[0]){
            finalCamera = scene.cameras[1]
        }else{
            finalCamera = scene.cameras[0]
        }
       
        scene.animationCamera = new MyCameraAnimation(scene, initialCamera, finalCamera, scene.timeCounter)
        
    }

    pressUndo(game_board, game_orchestrator,player,time){
        
        var button = player.press_undo()
    
        game_orchestrator.scene.buttons_animator = new MyButtonAnimation(game_orchestrator.scene,button,time,100)

        const [switchPlayers, captured] = game_board.undoMove()
        if (captured){
            game_board.removePieceFromBox(game_orchestrator.currentPlayer)
            game_orchestrator.allValidMoves = game_board.getValidMoves(game_orchestrator.currentPlayer)
        }
        if (switchPlayers){
            game_orchestrator.switchPlayers()
        }
    }

    async showReplay(gameOrchestrator, time){
        var button = gameOrchestrator.show_replay
    
        gameOrchestrator.scene.buttons_animator = new MyButtonAnimation(gameOrchestrator.scene,button,time,100)

        gameOrchestrator.showingReplay = true
        console.log(gameOrchestrator.gameBoard.getGameSequence().game_sequence)
        if(gameOrchestrator.gameBoard.getGameSequence().game_sequence.length == 0){
            console.log("Cant show a replay, no moves have been made yet!")
            gameOrchestrator.showingReplay = false
            return
        }
        gameOrchestrator.show_replay_board = new MyGameBoard(gameOrchestrator.scene)
        const myReplayer = new MyReplayer(gameOrchestrator.gameBoard.getGameSequence().game_sequence, gameOrchestrator.show_replay_board,
        gameOrchestrator.animator, gameOrchestrator.scene) 
        myReplayer.displayFullReplay(gameOrchestrator)
    }

    switchPlayers(){
        this.gameBoard.unregisterForPicking(this.currentPlayer)
        this.currentPlayer = this.getOpposingPlayer()
        this.allValidMoves = this.gameBoard.getValidMoves(this.currentPlayer)
        
        // this player has no valid moves remaining, so the other player won!
        if(this.allValidMoves.length == 0){
            this.announceWin(this.getOpposingPlayer())
            console.log("Congrats to", this.getOpposingPlayer(),"its THEIR WIN: ", this.playerScore)
            return true
        }

        return false
    }

    getOpposingPlayer(){
        this.timer.reset_player(this.currentPlayer)
        if (this.currentPlayer == 'white'){
            return 'black'
        }
        else{
            return 'white'
        }
        
    }


    changeScenery(gameOrchestrator,time){
        if (gameOrchestrator.currentPlayer == "white"){
            var p = gameOrchestrator.p1_pop_ups.get_pop_up()
        }else{
            var p = gameOrchestrator.p2_pop_ups.get_pop_up()
        }
        var button = p.get_change_button()
        gameOrchestrator.scene.buttons_animator = new MyButtonAnimation(gameOrchestrator.scene,button,time,100)

        gameOrchestrator.scene.changeXml()
    }


    during_game_button_actions(pickedID,time){
        switch(pickedID){
            case 81:
                this.buttons_map[pickedID](this.gameBoard, this,this.player1_buttons,time)
                return;
            case 91:
                this.buttons_map[pickedID](this.gameBoard, this,this.player2_buttons,time)
                return;
            case 86:
                this.buttons_map[pickedID](this.scene, this.player1_buttons,time)
                return
            case 96:
                this.buttons_map[pickedID](this.scene, this.player2_buttons,time)
                return;
            case 88:
                this.buttons_map[pickedID](this,time)
                return;
            case 84:
            case 94:
                this.buttons_map[pickedID](this,time)
                return
            case 101:
                this.buttons_map[pickedID](this.scene,this.p1_pop_ups,time)
                return
            case 103:
                this.buttons_map[pickedID](this.scene,this.p2_pop_ups,time)
                return
            default: 
                throw "error in ids"
        }
    }

    in_menu_actions(pickedID,time){
        switch(pickedID){
            case 97:
                this.buttons_map[pickedID](this,time)
                return;
            case 101:
                this.buttons_map[pickedID](this.scene,this.p1_pop_ups,time)
                return
            case 103:
                this.buttons_map[pickedID](this.scene,this.p2_pop_ups,time)
                return
            case 86:
                this.buttons_map[pickedID](this.scene, this.player1_buttons,time)
                return
            case 88:
                this.buttons_map[pickedID](this,time)
                return;
            case 96:
                this.buttons_map[pickedID](this.scene, this.player2_buttons,time)
                return;
            case 99:
                this.buttons_map[pickedID](this,time)
                return
            default:
                return

        }
    }

    piece_picking(pickedID,time){
        var coords_y = pickedID % 10
            var coords_x = Math.floor(pickedID / 10)
            this.coords_spotlight = [coords_y,coords_x] 
            if(this.gameBoard.tileHasPieceOfColor(coords_x,coords_y,this.currentPlayer)){
                this.gameBoard.setPickedTile(coords_x, coords_y, this.currentPlayer, this.allValidMoves)
            }else{
                // this is a player move 
                const scored = this.gameBoard.movePiece(coords_x, coords_y, this.currentPlayer, this.animator,time)
                //animate the move
                

                if (scored){
                    this.playerScore[this.currentPlayer]++
                
                    //after eating an opponents piece, check if they still have any pieces remaining
                    if(this.gameBoard.getPlayersTiles(this.getOpposingPlayer()).length == 0){
                        this.announceWin(this.currentPlayer)
                        console.log("Congrats to", this.currentPlayer ,"its THEIR WIN: ", this.playerScore)
                        this.gameRunning = false
                    }

                    this.allValidMoves = this.gameBoard.getValidMoves(this.currentPlayer)
                }else{
                    if (this.switchPlayers()){
                    
                        this.gameRunning = false
                    }
                }
    }
    }

    handlePicking(pickedID, time){
        if (this.gameRunning){
            if(pickedID in this.buttons_map){
                this.during_game_button_actions(pickedID,time)
                
            }else{
                this.piece_picking(pickedID,time)
            }               
        }else{
            this.in_menu_actions(pickedID,time)
        }
    }

    restartGame(gameOrchestrator,time){
        if (gameOrchestrator.currentPlayer == "white"){
            var p = gameOrchestrator.p1_pop_ups.get_pop_up()
        }else{
            var p = gameOrchestrator.p2_pop_ups.get_pop_up()
        }
        var button = p.get_start_button()
        gameOrchestrator.scene.buttons_animator = new MyButtonAnimation(gameOrchestrator.scene,button,time,100)

        gameOrchestrator.timer.reset()
        gameOrchestrator.gameBoard.reset()
        gameOrchestrator.gameRunning = true
        gameOrchestrator.allValidMoves = gameOrchestrator.gameBoard.getValidMoves(gameOrchestrator.currentPlayer)
        if (gameOrchestrator.currentPlayer == "white"){
        gameOrchestrator.p1_pop_ups.close_pop_up(gameOrchestrator.p1_pop_ups)}
        else{
            gameOrchestrator.p2_pop_ups.close_pop_up(gameOrchestrator.p2_pop_ups)
        }
    }

    announceWin(player){
        if (player == "white"){
            this.winP1()
        }else{
            this.winP2()
        }
    }

    winP1(){
        this.gameRunning = false
        this.p1_pop_ups.show_start_pop_up()
        this.currentPlayer = "white"
        this.p2_pop_ups.show_loser()
        this.p1_pop_ups.show_winner()
    }

    winP2(){
        this.gameRunning = false
        this.p2_pop_ups.show_start_pop_up()
        this.currentPlayer = "black"
        this.p1_pop_ups.show_loser()
        this.p2_pop_ups.show_winner()
    }

    giveUpP1(gameOrchestrator,time){
       
        var button = gameOrchestrator.player1_buttons.press_give_up()
        gameOrchestrator.scene.buttons_animator = new MyButtonAnimation(gameOrchestrator.scene,button,time,100)
        gameOrchestrator.winP2()
    }

    giveUpP2(gameOrchestrator,time){
        var button = gameOrchestrator.player2_buttons.press_give_up()
        gameOrchestrator.scene.buttons_animator = new MyButtonAnimation(gameOrchestrator.scene,button,time,100)
        gameOrchestrator.winP1()
    }

    timeOutP1(){
        this.gameRunning = false
        this.p2_pop_ups.show_start_pop_up()
        this.currentPlayer = "black"
        this.p1_pop_ups.show_time_out_p()
        this.p2_pop_ups.show_winner()
    }

    timeOutP2(){
        this.gameRunning = false
        this.p1_pop_ups.show_start_pop_up()
        this.currentPlayer = "white"
        this.p2_pop_ups.show_time_out_p()
        this.p1_pop_ups.show_winner()
    }

    timeOutTotal(){
        this.gameRunning = false
        switch(this.gameBoard.extra.getLead()){
            case "white":
                this.p1_pop_ups.show_start_pop_up()
                this.currentPlayer = "white"
                this.p2_pop_ups.show_time_out_loser()
                this.p1_pop_ups.show_time_out_winner()
                return
            case "black":
                this.p2_pop_ups.show_start_pop_up()
                this.currentPlayer = "black"
                this.p1_pop_ups.show_time_out_loser()
                this.p2_pop_ups.show_time_out_winner()
                return
            case "none":
                this.p1_pop_ups.show_start_pop_up()
                this.currentPlayer = "white"
                this.p1_pop_ups.show_time_out_draw()
                this.p2_pop_ups.show_time_out_draw()
                return
            default:
                throw "invalid result"
        }
        
    }

    // define which squares are clickable 
    registerForPicking(){
        this.gameBoard.registerPicking(this.currentPlayer)
    }

    update(time){
        this.animator.update(time)
    }

    update_every_second(){
        if ((this.gameRunning)){
        if (this.timer.update_player_time(this.currentPlayer)){
            if (this.currentPlayer == "white"){
                this.timeOutP1()
            }else{
                this.timeOutP2()
            }
        }
        
        if (this.timer.update_total_time()){
            this.timeOutTotal()
        }}
    }

    display() {
        if (!this.showingReplay){
            this.gameBoard.display();
        }else{
            this.show_replay_board.display()
        }
     
        this.animator.display();

        this.scene.pushMatrix();
        this.scene.rotate(90 * Math.PI / 180,0,1,0);
        this.scene.translate(-0.5,-1.1,-4)
        this.timer.display(this.currentPlayer);
        this.scene.popMatrix();

        this.player1_buttons.display();
        
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI,0,1,0);
        this.scene.translate(-1.7,0,4)
        this.player2_buttons.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(6,-1.23,-6)
        this.scene.scale(0.2, 0.2, 0.2);
        this.scene.rotate(-90 * Math.PI/180,0,1,0);
        this.show_replay.display();
        this.scene.popMatrix();

        this.p1_pop_ups.display()

        this.scene.pushMatrix();
        this.scene.translate(2,0,-4)
        this.scene.rotate( Math.PI,0,1,0);
        this.p2_pop_ups.display();
        this.scene.popMatrix();

    }
        
}
