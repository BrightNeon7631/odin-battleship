export default class Ship {
    constructor(arrayWithCoordinates) {
        // e.g. [[0, 0], [0, 1], [0, 2]] or [[0, 0], [1, 0], [2, 0]]
        this.shipArray = arrayWithCoordinates;
        this.hitsArray = [];
    }

    // e.g. [0, 0]
    hit(cordArray) {
        // checks if the coordinates are already in the hitsArray (to avoid the same values multiple times) 
        // and if they match the values in the ship array (accept only values relevant to this ship)
        if (
          this.checkIfCordsAlreadyInArray(this.hitsArray, cordArray) ===
            false &&
          this.checkIfCordsAlreadyInArray(this.shipArray, cordArray)
        ) {
          this.hitsArray.push(cordArray);
        }
    }

    // e.g. hitsArray = [[1, 2], [3, 4]]
    checkIfCordsAlreadyInArray(hitsArray, cordsArray) {
        for (let i = 0; i < hitsArray.length; i++) {
            if (cordsArray[0] === hitsArray[i][0] && cordsArray[1] === hitsArray[i][1]) {
                return true;
            }
        }
        return false;
    }

    isSunk() {
        if (this.shipArray.length === this.hitsArray.length) {
            return true;
        } else {
            return false;
        }
    }
}