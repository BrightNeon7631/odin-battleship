import Ship from '../classes/ship';

let someShip = new Ship([[0, 0], [0, 1], [0, 2]]);

test('returns ship object attributes', () => {
    expect(someShip).toEqual({"shipArray": [[0, 0], [0, 1], [0, 2]], "hitsArray": []});
});

test('checks if array comparison function works', () => {
    expect(someShip.checkIfCordsAlreadyInArray([[0, 0], [0, 1]], [0, 1])).toEqual(true);
});

test('records hit coordinates', () => {
    someShip.hit([0, 0]);
    expect(someShip.hitsArray).toEqual([[0, 0]]);
});

test(`doesn't record the same hit coordinates twice`, () => {
    someShip.hit([0, 0]);
    someShip.hit([0, 0]);
    expect(someShip.hitsArray).toEqual([[0, 0]]);
});

test('hit accepts only ship coordinates', () => {
    someShip.hit([0, 0]);
    someShip.hit([0, 1]);
    someShip.hit([0, 3]);
    expect(someShip.hitsArray).toEqual([[0, 0], [0, 1]]);
});

test('returns false if the ship is not sunk yet', () => {
    expect(someShip.isSunk()).toEqual(false);
});

test('returns true if the ship is sunk', () => {
    someShip.hit([0, 0]);
    someShip.hit([0, 1]);
    someShip.hit([0, 2]);
    expect(someShip.isSunk()).toEqual(true);
});