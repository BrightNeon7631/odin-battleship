import './style/index.css'
import { initializeGame } from './modules/game';
import { 
    upperScreen, 
    boardScreen, 
    shipImage 
} from './modules/home';

upperScreen();
shipImage();
boardScreen();

const restartButton = document.getElementById('restart-btn');
restartButton.addEventListener('click', (e) => {
    e.currentTarget.textContent = 'Restart Game';
    
    // removes the ship image
    const shipImage = document.getElementById('ship-img');
    if (shipImage) {
        shipImage.remove();
    }

    // removes existing boards
    const grids = document.querySelectorAll('.grid-container');
    if (grids.length === 2) {
        grids[0].remove();
        grids[1].remove();
        document.getElementById('info').textContent = '';
    }
    
    initializeGame();
})