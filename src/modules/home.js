import { 
    createNewElement, 
    addToContainer 
} from './utils/element';
import ship from '../assets/images/ship.jpg';

function upperScreen() {
  const top = createNewElement('div', 'top', null, 'Battleship Game');
  const content = document.getElementById('content');
  addToContainer(content, top);
}

function shipImage() {
  const shipImage = createNewElement('img', 'ship-img');
  shipImage.src = ship;
  const content = document.getElementById('content');
  addToContainer(content, shipImage);
}

function boardScreen() {
  const mid = createNewElement('div', 'mid');
  const boards = createNewElement('div', 'boards');
  const info = createNewElement('div', 'info');
  const button = createNewElement('button', 'restart-btn', null, 'Start Game');
  addToContainer(mid, boards, info, button);
  const content = document.getElementById('content');
  addToContainer(content, mid);
}

export { 
    upperScreen, 
    boardScreen, 
    shipImage 
};
