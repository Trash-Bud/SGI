const sleep = ms => new Promise(r => setTimeout(r, ms));

export class MyReplayer {

    constructor(game_sequence, game_board, animator, scene){
        this.game_sequence = game_sequence
        this.game_board = game_board
        this.scene = scene
        this.animator = animator
        this.currentPlayer = 'white'
    }
    switchPlayers(){
        if(this.currentPlayer == 'white'){
            this.currentPlayer = 'black'
        }else{
            this.currentPlayer = 'white'
        }
    }
    
    async displayFullReplay(game_orchestrator){
        var current_game_move = 0
        while(current_game_move < this.game_sequence.length){
            await sleep(1000)    
            if (this.animator.isAnimating()){
                console.log("animating! move_counter: ", current_game_move)
                
            }
            console.log("curr_move: ", current_game_move)
            var deepCopyTileBoard = []
            var previousTileBoard = this.game_sequence[current_game_move].getPreviousGameState()

            previousTileBoard.forEach(intermediateRow => {
                deepCopyTileBoard.push(intermediateRow.map(a => Object.assign(Object.create(Object.getPrototypeOf(a)), a)));
                
            });
            this.game_board.setBoard(deepCopyTileBoard)
            
            const madeCapture = this.game_sequence[current_game_move].isCapturingPlay()
            const [destination_coords_x, destination_coords_y] =  this.game_sequence[current_game_move].getDestinationTile()
            const [origin_coords_x, origin_coords_y] = this.game_sequence[current_game_move].getOriginTile()
            this.game_board.setLatestPickedTilePos(origin_coords_x, origin_coords_y)
            this.game_board.movePiece(destination_coords_x, destination_coords_y,this.currentPlayer,this.animator, this.scene.timeCounter )

            if(!madeCapture){
                this.switchPlayers()
            }

            current_game_move++
            

            }
            game_orchestrator.showingReplay = false
        }

        

       
       
    }
