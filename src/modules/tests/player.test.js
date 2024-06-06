import { Player } from '../classes/player';

let somePlayer;
let somePlayer2;
beforeEach(() => {
    somePlayer = new Player('Player 1', 5);
    somePlayer2 = new Player('Player 2', 5);
  });

test('creates player board correctly', () => {
    expect(somePlayer.board).toEqual({"gameboardArray": [[{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}], [{"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}, {"hasSunkShip": false, "hit": false, "shipID": null}]], "numberOfShips": 0, "ships": [], "sunkShips": 0});
});

test('creates player name correctly', () => {
    expect(somePlayer.name).toEqual('Player 1');
});

test(`fires at opponent's board`, () => {
    somePlayer2.board.createShips([[0, 0], [0, 1], [0, 2]]);
    somePlayer.fire([0, 0], somePlayer2.board);
    expect(somePlayer2.board.gameboardArray[0][0].hit).toEqual(true);
});