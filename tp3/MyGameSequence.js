
export class MyGameSequence {

    constructor(){
        this.game_sequence = []
    }

    addNewMove(new_move){
        this.game_sequence.push(new_move)
    }

    undoMove(){
        if (this.game_sequence.length > 0){
            var last_move = this.game_sequence.pop()
            
            return [last_move.getPreviousGameState(), last_move.isCapturingPlay(), last_move.getOriginTile(), last_move.madeAKing()]
        }
        return [false, false]
        
    }
    
    animateGameSequence(){
        this.game_sequence.forEach(move => {
            move.animate()
        });
    }
}