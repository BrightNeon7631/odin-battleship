import Gameboard from './gameboard';

class Player {
    constructor(name, boardSize = 10) {
        this.name = name;
        this.board = new Gameboard(boardSize);
    }

    fire(cords, opponentGameboard) { // cords [x, y]
        opponentGameboard.receiveAttack(cords[0], cords[1]);
    }
}

class Computer extends Player {
    constructor(name, boardSize = 10) {
        super(name, boardSize);
        this.foundPlayerShips = [];
    }

    randomMove(opponentGameboard) {
        let randomX;
        let randomY;
        
        while (true) {
            randomX = Math.floor(Math.random() * opponentGameboard.gameboardArray.length);
            randomY = Math.floor(Math.random() * opponentGameboard.gameboardArray.length);
    
            if (opponentGameboard.gameboardArray[randomX][randomY].hit === false) {
                this.fire([randomX, randomY], opponentGameboard);
                return [randomX, randomY];
            }
        }
    }

    // adds hit player's ship and next possible moves (to sink it) to the array
    AIFoundShip(cords, playerObject) {
        let x = cords[0];
        let y = cords[1];
        let boardElement = playerObject.board.gameboardArray[x][y];
        let checkIfShipInArray = this.AICheckIfFoundShipAlreadyInArray(boardElement.shipID);
        
        if (boardElement.shipID !== null && checkIfShipInArray === false) {
            let allPossibleMoves = [];
            let horizontalLeft = this.AIGetPossibleMovesHorizontal(cords, boardElement.shipID, playerObject);
            let horizontalRight = this.AIGetPossibleMovesHorizontal(cords, boardElement.shipID, playerObject, false);
            let verticalUp = this.AIGetPossibleMovesVertical(cords, boardElement.shipID, playerObject);
            let verticalDown = this.AIGetPossibleMovesVertical(cords, boardElement.shipID, playerObject, false);

            allPossibleMoves.push(horizontalLeft, horizontalRight, verticalUp, verticalDown);
            
            this.foundPlayerShips.push(
                {
                    shipID: boardElement.shipID, 
                    foundAtCords: cords, 
                    possibleMoves: allPossibleMoves
                }
            );
        }
    }

    // checks if a ship is already in the array to avoid duplicates 
    AICheckIfFoundShipAlreadyInArray(shipID) {
        for (let i = 0; i < this.foundPlayerShips.length; i++) {
            if (this.foundPlayerShips[i].shipID == shipID) {
                return true;
            }
        }
        return false;
    }

    AIGetPossibleMovesHorizontal(cords, shipID, playerObject, horizontalLeft = true) {
        let shipLength = playerObject.board.ships[shipID].shipArray.length;
        let x = cords[0];
        let y = cords[1];
        let possibleMovesArray = [];
        
        if (horizontalLeft === true) {
            // left option
            for (let i = 1; i < shipLength; i++) {
                if (playerObject.board.gameboardArray[x][y - i] !== undefined && 
                    playerObject.board.gameboardArray[x][y - i].hit === false) {
                    possibleMovesArray.push([x, y - i]);
                } else {
                    break;
                }
            }
        } else {
            // right option
            for (let i = 1; i < shipLength; i++) {
                if (playerObject.board.gameboardArray[x][y + i] !== undefined && 
                    playerObject.board.gameboardArray[x][y + i].hit === false) {
                    possibleMovesArray.push([x, y + i]);
                } else {
                    break;
                }
            }
        }
        return possibleMovesArray;
    }

    AIGetPossibleMovesVertical(cords, shipID, playerObject, verticalUp = true) {
        let shipLength = playerObject.board.ships[shipID].shipArray.length;
        let x = cords[0];
        let y = cords[1];
        let possibleMovesArray = [];
        
        if (verticalUp === true) {
            // up option
            for (let i = 1; i < shipLength; i++) {
                if (playerObject.board.gameboardArray[x - i] !== undefined && 
                    playerObject.board.gameboardArray[x - i][y].hit === false) {
                    possibleMovesArray.push([x - i, y]);
                } else {
                    break;
                }
            }
        } else {
            // down option
            for (let i = 1; i < shipLength; i++) {
                if (playerObject.board.gameboardArray[x + i] !== undefined && 
                    playerObject.board.gameboardArray[x + i][y].hit === false) {
                    possibleMovesArray.push([x + i, y]);
                } else {
                    break;
                }
            }
        }
        return possibleMovesArray;
    }

    // removes empty subarrays with possible moves
    AIRemoveArraysWithEmptyMoves(movesArray) {
        let newArray = [];
        for (let i = 0; i < movesArray.length; i++) {
            if (movesArray[i].length !== 0) {
                newArray.push(movesArray[i]);
            }
        }
        return newArray;
    }
}

export { 
    Player, 
    Computer 
};