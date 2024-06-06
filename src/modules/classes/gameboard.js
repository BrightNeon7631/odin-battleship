import Ship from './ship';

export default class Gameboard {
    constructor(size) { // size is ususually 10 (so 10x10=100)
        this.gameboardArray = this.generateGameboardArray(size);
        this.ships = [];
        this.numberOfShips = 0; // 5 max
        this.sunkShips = 0;
    }

    // creates a new Ship object and pushes it to the ships array
    // and then places that ship on the board
    createShips(arrayWithCoordinates = null, shipSize = null) {
        if (this.numberOfShips < 5) {
            // random cords
            if (arrayWithCoordinates === null) {
                let randomCords = this.getRandomShipCords(shipSize);
                let newShip = new Ship(randomCords);
                this.ships.push(newShip);
                this.placeShip(randomCords, this.numberOfShips);
            // provided cords
            } else {
                let newShip = new Ship(arrayWithCoordinates);
                this.ships.push(newShip);
                this.placeShip(arrayWithCoordinates, this.numberOfShips);
            }
            this.numberOfShips++;
        }
    }

    // accepts coordinates like [[0, 0], [0, 1], [0, 2]]; shipID = numberOfShips
    placeShip(arrayWithCoordinates, shipID) {
        for (let i = 0; i < arrayWithCoordinates.length; i++) {
            let x = arrayWithCoordinates[i][0];
            let y = arrayWithCoordinates[i][1];
            this.gameboardArray[x][y].shipID = shipID;
        }
    }

    getRandomShipCords(shipSize) {
        let gameboardArraySize = this.gameboardArray.length;
        
        while (true) {
            let randomX = Math.floor(Math.random() * gameboardArraySize);
            let randomY = Math.floor(Math.random() * gameboardArraySize);
    
            if (this.gameboardArray[randomX][randomY].shipID === null) {
                let cordsArray = [];
                // 0 - above; 1 - right; 2 - below; 3 - left
                let randomDirection = Math.floor(Math.random() * 4);
                for (let i = 0; i < shipSize; i++) {
                    // above
                    if (randomDirection === 0) {
                        if (this.gameboardArray[randomX - i] !== undefined && 
                            this.gameboardArray[randomX - i][randomY].shipID === null) {
                            cordsArray.push([randomX - i, randomY]);
                        }
                    // right
                    } else if (randomDirection === 1) {
                        if (this.gameboardArray[randomX][randomY + i] !== undefined && 
                            this.gameboardArray[randomX][randomY + i].shipID === null) {
                            cordsArray.push([randomX, randomY + i]);
                        }
                    // below
                    } else if (randomDirection === 2) {
                        if (this.gameboardArray[randomX + i] !== undefined && 
                            this.gameboardArray[randomX + i][randomY].shipID === null) {
                            cordsArray.push([randomX + i, randomY]);
                        }
                    // left
                    } else if (randomDirection === 3) {
                        if (this.gameboardArray[randomX][randomY - i] !== undefined && 
                            this.gameboardArray[randomX][randomY - i].shipID === null) {
                            cordsArray.push([randomX, randomY - i]);
                        }
                    }
                }

                if (cordsArray.length === shipSize) {
                    return cordsArray;
                }
            }
        }
    }

    receiveAttack(x, y) {
        if (this.gameboardArray[x][y].hit === false) {
            this.gameboardArray[x][y].hit = true;
            let shipID = this.gameboardArray[x][y].shipID;
            if (shipID !== null) {
                this.ships[shipID].hit([x, y]); // ship id = position in the ships array
                // check if sunk
                if (this.ships[shipID].isSunk()) {
                    this.sunkShipAction(this.ships[shipID].shipArray);
                }
            }
        }
    }

    sunkShipAction(ship) {
        // iterates through a ship's arrray ( like [[0, 0], [0, 1], [0, 2]] ) to get its cords
        for (let sunkShipCord = 0; sunkShipCord < ship.length; sunkShipCord++) {
            // e.g. [0, 2] x = 0; y = 2
            let x = ship[sunkShipCord][0];
            let y = ship[sunkShipCord][1];
            // changes the gameboard's object to show that this coordinate has a sunk ship now
            this.gameboardArray[x][y].hasSunkShip = true;
        }
        this.sunkShips++;
    }

    areAllShipsSunk() {
        if (this.sunkShips === this.numberOfShips) {
            return true;
        }
        return false;
    }

    generateGameboardArray(size) {
        let gameboardArray = [];
        for (let i = 0; i < size; i++) {
            gameboardArray[i] = [];
            for (let j = 0; j < size; j++) {
                gameboardArray[i][j] = { shipID: null, hit: false, hasSunkShip: false };
            }
        }
        return gameboardArray;
    }
}