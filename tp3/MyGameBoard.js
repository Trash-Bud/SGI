import { MyBox } from "./MyBox.js"
import { MyExtras } from "./MyExtras.js"
import { MyGameMove } from "./MyGameMove.js"
import { MyGameSequence } from "./MyGameSequence.js"
import { MyPiece } from "./MyPiece.js"
import { MyTile } from "./MyTile.js"


const whitePiecesPosition = [[0,0], [0,2],[0,4],[0,6], [1,1], [1,3],[1,5],[1,7],[2,0],[2,2],[2,4],[2,6]]
const blackPiecesPosition = [[5,1], [5,3],[5,5],[5,7], [6,0], [6,2],[6,4],[6,6],[7,1],[7,3],[7,5],[7,7]]

const WIDTH = 8
const HEIGHT = 8

export class MyGameBoard {

    constructor(scene){
        this.playersDirection = {'white': 1, 'black': - 1}
        this.gameSequence = new MyGameSequence()
        this.extra = new MyExtras(scene)
        this.bottom = new MyBox(scene)
        this.scene = scene
        var color = 'black'
        
        this.create_tiles(color)
        this.initializePieces()
    }

    create_tiles(color){
        this.tileBoard = []
        for(var i = 0; i < 8; i++){
            var intermediateRow = []
            for(var j = 0; j < 8; j++){
                const tilePosition = [i,j]
                
                intermediateRow.push(new MyTile(tilePosition,this.scene,color))
                if(j == 7) continue
                if (color == 'black'){
                     color = 'white'
                }
                else{
                    color = 'black'
                }
            }
            this.tileBoard.push(intermediateRow)
        }  
        this.latestPickedTilePosition = [0,0]
        this.latestSuggestedPlays = []
    }

    setLatestPickedTilePos(coords_x, coords_y){
        this.latestPickedTilePosition = [coords_x, coords_y]
    }

    addPieceToTile(x,y,color){
        var tile = this.tileBoard[x][y]
        tile.setPiece(new MyPiece('round', this.scene , color,false))
    }

    removePieceFromBox(currentPlayer){
        if(currentPlayer == 'white'){
            this.extra.remove_piece_player1()
        }else{
            this.extra.remove_piece_player2()
        }
    }


    getPlayersTiles(player){
        var playersTiles = []
        this.tileBoard.forEach(intermediateRow => {
            intermediateRow.forEach(tile => {
                if (tile.hasPiece() && tile.getPiece().getColor() == player){
                    playersTiles.push(tile)
                }
            });
        });

        return playersTiles
    }

    undoMove(){
        var switchPlayers = true
        
        const [prevTileBoard, isCapturing, origin_coords, made_a_king] = this.gameSequence.undoMove()
    
        if(isCapturing){
            switchPlayers = false
        }
        if(prevTileBoard){
            this.tileBoard = prevTileBoard
        }else{
            switchPlayers = false
        }

        if(made_a_king){
            this.tileBoard[origin_coords[0]][origin_coords[1]].getPiece().unmakeKing()
        }
        return [switchPlayers ,isCapturing]
    }

    setBoard(tileBoard){
        this.tileBoard = tileBoard
    }

    getValidMoves(currentPlayer){
        const playersTiles = this.getPlayersTiles(currentPlayer)
        var capturingPlayAvailable = false
        var validMoves = []
        playersTiles.forEach(tile => {
            const [tile_x, tile_y] = tile.getCoords()
            var possiblePlays = this.getPossibleMoves(tile_x, tile_y, currentPlayer)
            if(!capturingPlayAvailable && possiblePlays.find(move => move.isCapturingPlay()) != undefined){
                capturingPlayAvailable = true
            }
            
            validMoves.push(...possiblePlays)

        });

        if(capturingPlayAvailable){
            validMoves = validMoves.filter(move => move.isCapturingPlay() )
        }

        return validMoves
    }

    setPickedTile(coords_x, coords_y, currentPlayer, allValidMoves){
        var tile = this.tileBoard[coords_x][coords_y]
       
        this.unsetPickedTile(this.latestPickedTilePosition[0], this.latestPickedTilePosition[1])
        //unset previous highlighted tiles
        this.latestSuggestedPlays.forEach(latestPlays => {
            var tile = this.tileBoard[latestPlays[0]][latestPlays[1]]
            tile.unsetHighlighted()
            tile.unregisterForPicking()
        });
        this.latestSuggestedPlays = []
        tile.setPicked()
        // show suggested movements
        this.highlightSuggestedPlays(coords_x,coords_y,currentPlayer, allValidMoves)

        this.latestPickedTilePosition = [coords_x, coords_y]
    }  

    getGameSequence(){
        return this.gameSequence
    }

    getRealTilePosition(coords_x, coords_y){
        const coordsMap = {'0': 2, '1': 1, '2': 0, '3': -1, '4': -2, '5': -3, '6': -4, '7': -5}
        return [coords_y - 3, -coordsMap[coords_x.toString()], -1]
    }

    reset(){
        this.extra.reset()
        this.resetPieces()
        this.gameSequence = new MyGameSequence()
    }

    movePiece(coords_x, coords_y, currentPlayer, animator,time){
        const latestPicked_x = this.latestPickedTilePosition[0]
        const latestPicked_y = this.latestPickedTilePosition[1]
        
        const animationsDuration = 2

        var moveToTile = this.tileBoard[coords_x][coords_y]
        var intermediateTile = undefined

        var scored = false

        var moveTo_x = coords_x
        var moveTo_y = coords_y
        var boardClone = []

         //unsetting picked and highlighted tiles
        this.unsetPickedTile(this.latestPickedTilePosition[0], this.latestPickedTilePosition[1])

        var prev_tile =  this.tileBoard[latestPicked_x][latestPicked_y]
        prev_tile.unregisterForPicking()
        this.latestSuggestedPlays.forEach(latestPlays => {
            var tile = this.tileBoard[latestPlays[0]][latestPlays[1]]
            tile.unsetHighlighted()
            tile.unregisterForPicking()
        });

        this.tileBoard.forEach(intermediateRow => {
            boardClone.push(intermediateRow.map(a => Object.assign(Object.create(Object.getPrototypeOf(a)), a)));
            
        });
        
        var latestPickedTile = this.tileBoard[latestPicked_x][latestPicked_y]

        if(moveToTile.hasPiece()){
            
            // means we're about to eat a piece, and so our piece move to behind the other piece
            var eatenPiece = moveToTile.getPiece()
            eatenPiece.becomeAnimated()
            var direction_x = moveTo_x - latestPicked_x
            var direction_y = moveTo_y - latestPicked_y
            
            moveTo_x = coords_x + direction_x
            moveTo_y = coords_y + direction_y
            intermediateTile = this.tileBoard[coords_x][coords_y]
            
            const capturedPieceAbsolutePosition = this.getRealTilePosition(coords_x, coords_y)

            moveToTile = this.tileBoard[moveTo_x][moveTo_y]
            scored = true
            if(currentPlayer == 'white'){
                if (eatenPiece.isKing){
                    var pos_in_box = this.extra.add_piece_player1(eatenPiece)
                    animator.makeACapturingAnimation(time,
                         [capturedPieceAbsolutePosition[0],capturedPieceAbsolutePosition[1],capturedPieceAbsolutePosition[2]+0.25], [pos_in_box[0],pos_in_box[1], pos_in_box[2]-1], eatenPiece,3, animationsDuration)
                }
                var pos_in_box = this.extra.add_piece_player1(eatenPiece)
                
                animator.makeACapturingAnimation(time, 
                    capturedPieceAbsolutePosition, [pos_in_box[0],pos_in_box[1], pos_in_box[2]-1], eatenPiece,2, animationsDuration)
            }else{
                if (eatenPiece.isKing){
                    var pos_in_box = this.extra.add_piece_player2(eatenPiece)
                    animator.makeACapturingAnimation(time, [capturedPieceAbsolutePosition[0],capturedPieceAbsolutePosition[1],capturedPieceAbsolutePosition[2]+0.25], 
                        [pos_in_box[0],pos_in_box[1], pos_in_box[2]-1], eatenPiece,3, animationsDuration)
                }
                var pos_in_box = this.extra.add_piece_player2(eatenPiece)
                
                animator.makeACapturingAnimation(time, capturedPieceAbsolutePosition, 
                    [pos_in_box[0],pos_in_box[1], pos_in_box[2]-1], eatenPiece,2, animationsDuration)
            }
            
        }

        //before applying changes to the board, store it in a gameMove sequence
        

        var madeAKing = false
        var piece = latestPickedTile.getPiece()
        
        const movedPieceAbsolutePosition = this.getRealTilePosition(latestPicked_x, latestPicked_y)
        const destinationTileAbsolutePosition = this.getRealTilePosition(moveTo_x, moveTo_y)

        animator.makeAMovePieceAnimation(time,movedPieceAbsolutePosition, destinationTileAbsolutePosition, piece, animationsDuration- 1.5)
        if (piece != undefined) piece.becomeAnimated()

        latestPickedTile.setPiece(undefined)
        if (intermediateTile != undefined){
            intermediateTile.setPiece(undefined)
        }
        

        if(this.isLastTile(moveTo_x)){
            if (!piece.king()){
            
                if(currentPlayer == 'white'){
                    if (!this.extra.empty_p2()){
                    var initial_pos = this.extra.get_last_pos_p2()
                    var rem_piece =this.extra.remove_piece_player2()
                    animator.makeAKingAnimation(time, [initial_pos[0],initial_pos[1],initial_pos[2]],
                         [destinationTileAbsolutePosition[0],destinationTileAbsolutePosition[1], destinationTileAbsolutePosition[2]+0.25], rem_piece,2, animationsDuration)
                }

                }else{
                    if (!this.extra.empty_p1()){
                    var initial_pos = this.extra.get_last_pos_p1()
                    var rem_piece =this.extra.remove_piece_player1()
                    animator.makeAKingAnimation(time, [initial_pos[0],initial_pos[1],initial_pos[2]], 
                        [destinationTileAbsolutePosition[0],destinationTileAbsolutePosition[1], destinationTileAbsolutePosition[2]+0.25], rem_piece,2, animationsDuration)
                    }
                }
                piece.makeKing()
                madeAKing = true
                
            }
                
        }

        if (intermediateTile != undefined){
            intermediateTile.setPiece(undefined)
            this.gameSequence.addNewMove(new MyGameMove(latestPickedTile.getCoords(), intermediateTile.getCoords(), 
            scored,boardClone, madeAKing))
        }else{
            this.gameSequence.addNewMove(new MyGameMove(latestPickedTile.getCoords(), moveToTile.getCoords(), scored,boardClone, madeAKing))
        }
        
        
        

        moveToTile.setPiece(piece)
        
        return scored
    }

    isLastTile(coords_x){
        if(coords_x == WIDTH - 1 || coords_x == 0){
            return true
        }
        return false
    }

    isPlayInBounds(x,y){
        
        if(x < 0 || x >= WIDTH){
            return false
        }
        if(y < 0 || y >= HEIGHT){
            return false
        }
        return true
    }

    getPossibleMoves(piece_x, piece_y, currentPlayer){
        var direction = this.playersDirection[currentPlayer]

        var tile = undefined

        var possibleGameMoves = []

        var possiblePlays = [[piece_x, direction, - 1], [piece_x, direction, 1]]
        const currentTile = this.tileBoard[piece_x][piece_y]
        if(currentTile.getPiece().isKing){
            possiblePlays.push([piece_x, - direction, - 1])
            possiblePlays.push([piece_x,  - direction, 1])
        }

        possiblePlays.forEach(play => {
            const play_x = play[0] + play[1]
            const play_y = piece_y + play[2]
            if(this.isPlayInBounds(play_x, play_y)){
                tile = this.tileBoard[play_x][play_y]
                if(tile.hasPiece()){
                    if(tile.getPiece().getColor() == currentPlayer){
                        return
                    }else{
                        //evaluate if the space behind the opposing piece is empty so we may eat it
                        const furtherPlay_x = piece_x + play[1] * 2
                        const furtherPlay_y = piece_y + play[2] * 2
                        if(this.isPlayInBounds(furtherPlay_x, furtherPlay_y)){
                            var furtherTile = this.tileBoard[furtherPlay_x][furtherPlay_y]
                            if(!furtherTile.hasPiece()){
                                // makes capture
                                possibleGameMoves.push(new MyGameMove([piece_x, piece_y],[play_x, play_y], true))
                                
                            }
                        }
                        
                    }
                }
                else{
                    possibleGameMoves.push(new MyGameMove([piece_x, piece_y],[play_x, play_y], false))
                    
                }
                
        }
    });

    return possibleGameMoves
    

    }

    highlightSuggestedPlays(piece_x, piece_y, currentPlayer, allValidMoves){
        

        const possiblePlays = this.getPossibleMoves(piece_x, piece_y, currentPlayer)
        
        possiblePlays.forEach(play => {
            if(allValidMoves.find(move => JSON.stringify(move)==JSON.stringify(play)) != undefined){
                this.latestSuggestedPlays.push(play.getDestinationTile())
            }
            
        });

        this.latestSuggestedPlays.forEach(play => {
        const tile = this.tileBoard[play[0]][play[1]]
        tile.setHighlighted()
        tile.registerForPicking()
    });

    }

    tileHasPieceOfColor(coords_x, coords_y, color){
        const tile = this.tileBoard[coords_x][coords_y]
        if(tile.hasPiece() && tile.getPiece().getColor() == color){
            return true
        }
        return false
    }


    unsetPickedTile(coords_x, coords_y){
        var tile = this.tileBoard[coords_x][coords_y]
        tile.unsetPicked()
    }

    registerPicking(currentPlayer){
        this.tileBoard.forEach(intermediateRow => {
            intermediateRow.forEach(tile => {
                if (tile.hasPiece() && tile.getPiece().getColor() == currentPlayer){
                    tile.registerForPicking()
                }
            });
        });
    }

    unregisterForPicking(currentPlayer){
        this.tileBoard.forEach(intermediateRow => {
            intermediateRow.forEach(tile => {
                if (tile.hasPiece() && tile.getPiece().getColor() == currentPlayer){
                    tile.unregisterForPicking()
                }
            });
        });
        const lastPickedTile = this.tileBoard[this.latestPickedTilePosition[0]][this.latestPickedTilePosition[1]]
        lastPickedTile.unregisterForPicking()
    }

    initializePieces(){
        //white pieces
        whitePiecesPosition.forEach(pos => {
            
            this.addPieceToTile(pos[0], pos[1], 'white')
        });

        blackPiecesPosition.forEach(pos => {
            this.addPieceToTile(pos[0], pos[1], 'black')
        });

        
    }

    resetPieces(){
        this.create_tiles("black")
        this.initializePieces();
    }

    display(){
        

        this.tileBoard.forEach(intermediateRow => {
            intermediateRow.forEach(tile => {
                tile.display()
            });
        });

        this.scene.brown.apply()

        this.scene.pushMatrix();
        this.scene.translate(-3.5,-1.11,2.5)
        this.scene.scale(9,0.1,9);
        this.bottom.display();
        this.scene.popMatrix();

        this.extra.display()
    
    }
}