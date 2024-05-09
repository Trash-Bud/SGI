

export class MyGameMove{

    constructor(origin_tile, destination_tile, makesCapture, gameboard_state_prev, made_a_king){
        this.origin_tile = origin_tile
        this.destination_tile = destination_tile
        this.makesCapture = makesCapture
        this.gameboard_state_prev = gameboard_state_prev
        this.made_a_king = made_a_king
    }

    isCapturingPlay(){
        return this.makesCapture
    }

    madeAKing(){
        return this.made_a_king
    }

    getOriginTile(){
        return this.origin_tile
    }

    getDestinationTile(){
        return this.destination_tile
    }

    getPreviousGameState(){
        return this.gameboard_state_prev
    }

    animate(){
        
    }

   
}