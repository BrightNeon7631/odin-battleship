import Gameboard from '../classes/gameboard';

let someBoard;
beforeEach(() => {
    someBoard = new Gameboard(5);
  });

test('creates a board array of size 5', () => {
    expect(someBoard.gameboardArray).toEqual([[{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}]]);
});

test('creates a new ship', () => {
    someBoard.createShips([[0, 0], [0, 1], [0, 2]]);
    expect(someBoard.ships[0]).toEqual({"hitsArray": [], "shipArray": [[0, 0], [0, 1], [0, 2]]});
});

test('creates two ships', () => {
    someBoard.createShips([[0, 0], [0, 1], [0, 2]]);
    someBoard.createShips([[1, 0], [1, 1], [1, 2]]);
    expect(someBoard.ships).toEqual([{"hitsArray": [], "shipArray": [[0, 0], [0, 1], [0, 2]]}, {"hitsArray": [], "shipArray": [[1, 0], [1, 1], [1, 2]]}]);
});

test('places ships on the board at specified coordinates', () => {
    someBoard.placeShip([[0, 0], [0, 1], [0, 2]], 0);
    expect(someBoard.gameboardArray[0]).toEqual([{"hasSunkShip": false, "hit": false, "shipID": 0}, {"hasSunkShip": false, "hit": false, "shipID": 0}, {"hasSunkShip": false, "hit": false, "shipID": 0}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}]);
});

test('receives attack at specified coordinates (miss)', () => {
    someBoard.receiveAttack(0, 1);
    expect(someBoard.gameboardArray[0][1].hit).toEqual(true);
});

test('hits ship twice', () => {
    someBoard.createShips([[0, 0], [0, 1], [0, 2]]);
    someBoard.receiveAttack(0, 1);
    someBoard.receiveAttack(0, 0);
    expect(someBoard.gameboardArray[0][1]).toEqual({"hasSunkShip": false, "hit": true, "shipID": 0}); // id present means there's a ship
    expect(someBoard.ships[0].hitsArray).toEqual([[0, 1], [0, 0]]);
});

test('sinks the ship', () => {
    someBoard.createShips([[0, 0], [0, 1], [0, 2]]);
    someBoard.receiveAttack(0, 1);
    someBoard.receiveAttack(0, 0);
    someBoard.receiveAttack(0, 2);
    expect(someBoard.gameboardArray[0]).toEqual([{"hasSunkShip": true, "hit": true, "shipID": 0}, {"hasSunkShip": true, "hit": true, "shipID": 0}, {"hasSunkShip": true, "hit": true, "shipID": 0}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}]);
});

test('checks if all ships are sunk', () => {
    someBoard.createShips([[0, 0], [0, 1], [0, 2]]);
    someBoard.receiveAttack(0, 1);
    someBoard.receiveAttack(0, 0);
    someBoard.receiveAttack(0, 2);
    expect(someBoard.areAllShipsSunk()).toEqual(true);
});

test('generates random ship coordinates', () => {
    // coordinates will usually be different
    expect(someBoard.getRandomShipCords(3) !== someBoard.getRandomShipCords(3)).toEqual(true);
});

test('places ships at random coordinates', () => {
    let newBoard1 = new Gameboard(10);
    let newBoard2 = new Gameboard(10);
    newBoard1.createShips(null, 3);
    newBoard2.createShips(null, 3);
    expect(newBoard1.gameboardArray !== newBoard2.gameboardArray).toEqual(true);
});