import { COORDINATES_MAP, PLAYERS } from "./constants.js";

const diceButtonElement = document.querySelector('#dice-btn');
const playerPiecesElements = {
    P1: document.querySelectorAll('[player-id="P1"].player-piece'),
    P2: document.querySelectorAll('[player-id="P2"].player-piece'),
    P3: document.querySelectorAll('[player-id="P3"].player-piece'),
    P4: document.querySelectorAll('[player-id="P4"].player-piece'),
};

export class ParchisUI {
    static listenDiceClick(callback) {
        diceButtonElement.addEventListener('click', callback);
    }

    static listenResetClick(callback) {
        document.querySelector('button#reset-btn').addEventListener('click', callback);
    }

    static listenPieceClick(callback) {
        document.querySelector('.player-pieces').addEventListener('click', callback);
    }

    static setPiecePosition(player, piece, newposition) {
        const [x, y] = COORDINATES_MAP[newposition];
        const pieceElement = playerPiecesElements[player][piece];
        pieceElement.style.top = `${x}%`;
        pieceElement.style.left = `${y}%`;
    }

    static setTurn(index) {
        const player = PLAYERS[index];
        document.querySelector('.active-player span').innerText = player;
        document.querySelector('.player-base.highlight')?.classList.remove('highlight');
        document.querySelector(`[player-id="${player}"].player-base`).classList.add('highlight');
    }

    static enableDiceButton() {
        diceButtonElement.removeAttribute('disabled');
    }

    static disableDiceButton() {
        diceButtonElement.setAttribute('disabled', '');
    }

    static highlightPieces(player, pieces) {
        pieces.forEach(piece => playerPiecesElements[player][piece].classList.add('highlight'));
    }

    static unhighlightPieces() {
        document.querySelectorAll('.player-piece.highlight').forEach(ele => ele.classList.remove('highlight'));
    }

    static setDiceValues(values) {
        document.querySelector('.dice-value').innerText = values.join(' & ');
    }
}
