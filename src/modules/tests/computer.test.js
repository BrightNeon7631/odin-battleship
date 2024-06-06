// const Computer = require('./Player');
// const Player = require('./Player');
import { Player, Computer } from '../classes/player';

let computerObject;
let playerObject;
beforeEach(() => {
    computerObject = new Computer('Computer 1', 5);
    playerObject = new Player('Computer 2', 5);
});

test(`fires at opponent's board (random move)`, () => {
  let cords = computerObject.randomMove(playerObject.board);
    expect(playerObject.board.gameboardArray[cords[0]][cords[1]].hit).toEqual(true);
});

test('computer sinks all player ships', () => {
  playerObject.board.createShips([[1, 1], [2, 1], [3, 1]]);
  playerObject.board.createShips([[0, 1], [0, 2], [0, 3]]);
  while (playerObject.board.areAllShipsSunk() === false) {
    // if computer found any ships in previous moves it will try hitting and sinking the first found ship
    if (computerObject.foundPlayerShips.length > 0) {
        let foundShipID = computerObject.foundPlayerShips[0].shipID;

        // removes empty subarrays 
        computerObject.foundPlayerShips[0].possibleMoves = computerObject.AIRemoveArraysWithEmptyMoves(computerObject.foundPlayerShips[0].possibleMoves);

        let cordss = computerObject.foundPlayerShips[0].possibleMoves[0][0];
        computerObject.fire(cordss, playerObject.board);

        // adds a new ship to the foundShips array if computer hit another ship 
        if (playerObject.board.gameboardArray[cordss[0]][cordss[1]].shipID != foundShipID && 
            playerObject.board.gameboardArray[cordss[0]][cordss[1]].shipID !== null) {
            computerObject.AIFoundShip(cordss, playerObject);
        }

        // removes the entire subarray with e.g. possible horizontal left moves if the coordinates didn't have the ship
        if (playerObject.board.gameboardArray[cordss[0]][cordss[1]].shipID != foundShipID) {
            computerObject.foundPlayerShips[0].possibleMoves.shift();
        // if there's a hit, removes just the first element from this subarray, so the computer can continue with this in the next move
        } else {
            computerObject.foundPlayerShips[0].possibleMoves[0].shift();
        }

        // remove the ship from the foundShips array if computer has hit and sunk it
        if (playerObject.board.gameboardArray[cordss[0]][cordss[1]].shipID == foundShipID && 
            playerObject.board.gameboardArray[cordss[0]][cordss[1]].hasSunkShip === true) {
            computerObject.foundPlayerShips.shift();
        }

    // if the foundShips array is empty, computer will make a random move instead
    } else {
        let computerPlaysCords = computerObject.randomMove(playerObject.board);
        // if computer hit a ship, add it to the found ships array
        computerObject.AIFoundShip(computerPlaysCords, playerObject);
    }
}
  expect(playerObject.board.areAllShipsSunk()).toEqual(true);
});