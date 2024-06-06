import { 
    createNewElement, 
    addToContainer 
} from './utils/element';

function generateGrid(size, player, container, playableClass = null) {
    const content = document.getElementById(container);
    const gridContainer = createNewElement('div', null, ['grid-container', player]);
    const playerName = createNewElement('div', null, ['grid-name'], `${player}'s board`)
    const grid = createNewElement('div', null, ['grid']);
    
    for (let i = 0; i < size; i++) {
        const gridRow = createNewElement('div', null, ['grid-row']);
        for (let j = 0; j < size; j++) {
            const gridRowElement = createNewElement(
              'div',
              null,
              ['grid-row-element', `grid-row-element-${player}`],
              null,
              [
                { name: 'x-cord', value: i },
                { name: 'y-cord', value: j },
              ]
            );
            if (playableClass !== null) {
                gridRowElement.classList.add(playableClass);
            }
            addToContainer(gridRow, gridRowElement);
        }
        addToContainer(grid, gridRow);
    }

    addToContainer(gridContainer, playerName, grid);

    // create main container for player blocks
    if (playableClass === null) {
        const blocks = createNewElement('div', 'blocks');
        addToContainer(gridContainer, blocks);
    }

    addToContainer(content, gridContainer);
}

// returns coordinates when the user selects a box on the board
function playerMove(gridElementClass) {
    return new Promise ((resolve) => {
        const gridElement = document.querySelectorAll(gridElementClass);
    
        const values = [];
        gridElement.forEach(element => element.addEventListener('click', (e) => {
            let x = parseInt(e.currentTarget.getAttribute('x-cord'));
            let y = parseInt(e.currentTarget.getAttribute('y-cord'));
            if (values.length === 2) {
                resolve(values);
            } else {
                values.push(x, y);
                e.currentTarget.classList.remove(gridElementClass.substring(1));
                if (values.length === 2) {
                    resolve(values);
                }
            }
        }));
    })
}

// takes a gameboard array (from the player or computer object)
// iterates through the array and changes the grid accordingly by adding classes to the elements
function updateBoard(gameboard, gridClass) {
    for (let i = 0; i < gameboard.length; i++) {
        for (let j = 0; j < gameboard.length; j++) {
            const gridElement = document.querySelector(`.${gridClass}[x-cord="${i}"][y-cord="${j}"]`);
            if (gameboard[i][j].hit === true && gameboard[i][j].hasSunkShip === true) {
                gridElement.classList.add('sunk');
            } else if (gameboard[i][j].hit === true && gameboard[i][j].shipID !== null) {
                gridElement.classList.add('hit');
            } else if (gameboard[i][j].hit === true && gameboard[i][j].shipID === null) {
                gridElement.classList.add('miss');
            }
        }
    }
}

// displays ships on the grid (for random player ship placement)
function updateBoardShips(gameboard, gridClass) {
    for (let i = 0; i < gameboard.length; i++) {
        for (let j = 0; j < gameboard.length; j++) {
            const gridElement = document.querySelector(`.${gridClass}[x-cord="${i}"][y-cord="${j}"]`);
            if (gameboard[i][j].shipID !== null) {
                gridElement.classList.add('ship');
            }
        }
    }
}

function displayGameResults(infoElement, computerObject) {
    const results = document.getElementById(infoElement);
    if (computerObject.board.areAllShipsSunk() === true) {
        results.textContent = 'Player won!';
    } else {
        results.textContent = 'Computer won!';
    }
}

function createBlock(size, customID = size) {
    const blockContainer = createNewElement('div', `block-container-${customID}`, ['block-container']);

    for (let i = 0; i < size; i++) {
        const block = createNewElement('div', null, ['block']);
        addToContainer(blockContainer, block);
    }
    
    blockContainer.draggable = true;
    return blockContainer;
}

function createButton(text) {
    const button = createNewElement('button', `${text}-button`, null, text)
    const infoDiv = document.getElementById('info');
    addToContainer(infoDiv, button);
    return button;
}

// width of block containers = number of blocks * their size; fixes container width issue on Chrome
function setBlockContainerWidthHeight(vertical = false) {
    const blockContainers = document.querySelectorAll('.block-container');
    const blockWidth = 40;
    for (let i = 0; i < blockContainers.length; i++) {
        const blockLength = blockContainers[i].getElementsByTagName('div').length;

        if (vertical === false) {
            blockContainers[i].style.width = `${blockLength * blockWidth}px`;
            blockContainers[i].style.height = `40px`;
        } else {
            blockContainers[i].style.height = `${blockLength * blockWidth}px`;
            blockContainers[i].style.width = `40px`;
        }
    }
}

export { 
    generateGrid, 
    playerMove, 
    updateBoard, 
    updateBoardShips, 
    displayGameResults, 
    createBlock, 
    createButton, 
    setBlockContainerWidthHeight
};