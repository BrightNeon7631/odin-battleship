import { addToContainer } from './utils/element';
import { 
  Player, 
  Computer 
} from './classes/player';
import { 
    generateGrid, 
    playerMove, 
    updateBoard, 
    updateBoardShips, 
    displayGameResults, 
    createBlock, 
    createButton, 
    setBlockContainerWidthHeight
} from './dom';

async function initializeGame(size = 10) {
    generateGrid(size, 'player', 'boards');
    generateGrid(size, 'computer', 'boards', 'playable');

    let player1 = new Player('player1', size);
    let computer1 = new Computer('computer1', size);

    // random ships for computer
    computer1.board.createShips(null, 5);
    computer1.board.createShips(null, 4);
    computer1.board.createShips(null, 3);
    computer1.board.createShips(null, 3);
    computer1.board.createShips(null, 2);

    // this function either returns previosuly declared player1 object with manualy placed ships 
    // or a new player object with randomly placed ships
    let playerObject = await dragAndDrop(player1, size);

    // start the game if all ships are placed
    gameWithAI(playerObject, computer1);
}

// drag and drop players ships
function dragAndDrop(player1, size) {
    return new Promise((resolve) => {
        // removes existing drag & drop blocks first
        document.querySelectorAll('.block-container').forEach(block => block.remove());

        // recreates them
        const mainBlockContainer = document.getElementById('blocks');
        addToContainer(
            mainBlockContainer,
            createBlock(5),
            createBlock(4),
            createBlock(3),
            createBlock(3, '3-2'),
            createBlock(2)
        );

        // width of block containers = number of blocks inside * their width
        setBlockContainerWidthHeight();

        // create buttons and select them by id
        const randomButton = createButton('random');
        const flipButton = createButton('flip');

        const blockToDrag = document.querySelectorAll('.block-container');
        blockToDrag.forEach(block => block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.currentTarget.id);
        }))

        const gridBoxes = document.querySelectorAll('.grid-row-element-player');
        gridBoxes.forEach(box => {
            box.addEventListener('dragover', dragOver);
            box.addEventListener('dragleave', dragLeave);
            box.addEventListener('drop', drop);
        });

        function dragOver(e) {
            e.preventDefault();
            e.target.classList.add('drag-over');
        }

        function dragLeave(e) {
            e.target.classList.remove('drag-over');
        }

        function drop(e) {
            e.target.classList.remove('drag-over');

            // element's id
            const id = e.dataTransfer.getData('text/plain');

            // coordinates of the grid box where the ship block will be dropped
            let x = e.currentTarget.getAttribute('x-cord');
            let y = e.currentTarget.getAttribute('y-cord');

            // get block's length; each box inside = ship size
            const blockLength = document.getElementById(id).getElementsByTagName('div').length;

            // do nothing if ship / block is out of bounds or there's already a ship in its path
            // horizontal
            if (document.getElementById(id).classList.contains('vertical') === false) {
                for (let i = 0; i < blockLength; i++) {
                    if (document.querySelector(`.grid-row-element-player[x-cord="${x}"][y-cord="${parseInt(y) + i}"]`) == undefined ||
                        document.querySelector(`.grid-row-element-player[x-cord="${x}"][y-cord="${parseInt(y) + i}"]`).classList.contains('ship') == true) {
                        return;
                    }
                }
                // vertical
            } else {
                for (let i = 0; i < blockLength; i++) {
                    if (document.querySelector(`.grid-row-element-player[x-cord="${parseInt(x) + i}"][y-cord="${y}"]`) == undefined ||
                        document.querySelector(`.grid-row-element-player[x-cord="${parseInt(x) + i}"][y-cord="${y}"]`).classList.contains('ship') == true) {
                        return;
                    }
                }
            }

            // if the ship / block can be placed, get the cords and create a new ship
            const arrayCords = [];
            // horizontal
            if (document.getElementById(id).classList.contains('vertical') === false) {
                for (let i = 0; i < blockLength; i++) {
                    const doc = document.querySelector(`.grid-row-element-player[x-cord="${x}"][y-cord="${parseInt(y) + i}"]`);
                    doc.classList.add('ship');
                    document.getElementById(id).classList.add('hide');
                    arrayCords.push([parseInt(x), parseInt(y) + i]);
                }
                // vertical
            } else {
                for (let i = 0; i < blockLength; i++) {
                    const doc = document.querySelector(`.grid-row-element-player[x-cord="${parseInt(x) + i}"][y-cord="${y}"]`);
                    doc.classList.add('ship');
                    document.getElementById(id).classList.add('hide');
                    arrayCords.push([parseInt(x) + i, parseInt(y)]);
                }
            }

            // creates a new ship based on the cords
            player1.board.createShips(arrayCords);

            if (player1.board.numberOfShips === 5) {
                randomButton.classList.add('hide');
                flipButton.classList.add('hide');
                resolve(player1);
            }
        }

        // flips the ship blocks horizontally or vertically
        flipButton.addEventListener('click', () => {
            if (blockToDrag[0].classList.contains('vertical') === false) {
                blockToDrag.forEach(block => block.classList.add('vertical'));
                mainBlockContainer.classList.add('blocks-flex');
                setBlockContainerWidthHeight(true);
            } else {
                blockToDrag.forEach(block => block.classList.remove('vertical'));
                mainBlockContainer.classList.remove('blocks-flex');
                setBlockContainerWidthHeight();
            }
        })

        // places player's ships randomly
        randomButton.addEventListener('click', (e) => {
            // remove buttons and blocks
            e.currentTarget.classList.add('hide');
            mainBlockContainer.classList.add('hide');
            flipButton.classList.add('hide');

            // clear player and computer boards and then recreate them
            const grids = document.querySelectorAll('.grid-container');
            grids[0].remove();
            grids[1].remove();

            generateGrid(size, 'player', 'boards');
            generateGrid(size, 'computer', 'boards', 'playable');

            // create a new player object
            player1 = new Player('player1', size);

            // create new ships randomly and show them
            player1.board.createShips(null, 5);
            player1.board.createShips(null, 4);
            player1.board.createShips(null, 3);
            player1.board.createShips(null, 3);
            player1.board.createShips(null, 2);
            updateBoardShips(player1.board.gameboardArray, 'grid-row-element-player');

            resolve(player1);
        })
    })
}

// computer makes a random move first but checks adjacent boxes after hitting a ship until it's sunk
async function gameWithAI(playerObject, computerObject) {
    // the game ends when all player or computer ships are sunk
    while (computerObject.board.areAllShipsSunk() === false && playerObject.board.areAllShipsSunk() === false) {
        
        // Player plays
        // allows player to select a box on the computer's grid and get its coordinates
        let cords = await playerMove('.playable');
        playerObject.fire(cords, computerObject.board);
        updateBoard(computerObject.board.gameboardArray, 'grid-row-element-computer');

        // Computer plays
        // if computer found any ships in previous moves it will try hitting and sinking the first found ship
        if (computerObject.foundPlayerShips.length > 0) {
            let foundShipID = computerObject.foundPlayerShips[0].shipID;

            // removes empty subarrays 
            computerObject.foundPlayerShips[0].possibleMoves =
              computerObject.AIRemoveArraysWithEmptyMoves(
                computerObject.foundPlayerShips[0].possibleMoves
              );

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
            // if there's a hit, removes just the first element from this subarray, 
            // so the computer can continue with this in the next move
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

        updateBoard(playerObject.board.gameboardArray, 'grid-row-element-player');
    }
    
    // display game results when all computer's or player's ships have been sunk
    displayGameResults('info', computerObject);
}

export { initializeGame }