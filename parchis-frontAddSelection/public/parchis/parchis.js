import { ParchisUI } from "./ui.js";
import { BASE_POSITIONS, HOME_ENTRANCE, HOME_POSITIONS, PLAYERS, SAFE_POSITIONS, START_POSITIONS, STATE, TURNING_POINTS, diceImages } from "./constants.js";

export class Parchis {
    currentPositions = {
        P1: [],
        P2: [],
        P3: [],
        P4: [],
    };

    _diceValues = [];
    get diceValues() {
        return this._diceValues;
    }

    set diceValues(values) {
        this._diceValues = values;
        this._remainingDiceValues = [...values];
        ParchisUI.setDiceValues(values);
    }

    _remainingDiceValues = [];
    get remainingDiceValues() {
        return this._remainingDiceValues;
    }

    _turn;
    get turn() {
        return this._turn;
    }
    set turn(value) {
        this._turn = value;
        ParchisUI.setTurn(value);
    }

    _state;
    get state() {
        return this._state;
    }
    
    set state(value) {
        this._state = value;

        if (value === STATE.DICE_NOT_ROLLED) {
            ParchisUI.enableDiceButton();
            ParchisUI.unhighlightPieces();
        } else {
            ParchisUI.disableDiceButton();
        }
    }

    constructor() {
        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();
        this.resetGame();
    }

    listenDiceClick() {
        ParchisUI.listenDiceClick(this.onDiceClick.bind(this));
    }

    onDiceClick() {
        const [randomIndex1, randomIndex2] = rollTwoDice();
        this.diceValues = [randomIndex1 + 1, randomIndex2 + 1];
        this.state = STATE.DICE_ROLLED;
        this.checkElegiblePieces();
    }

    checkElegiblePieces() {
        const player = PLAYERS[this.turn];
        const elegiblePieces = this.getElegiblePieces(player);
        if (elegiblePieces.length) {
            ParchisUI.highlightPieces(player, elegiblePieces);
        } else {
            this.incrementTurn();
        }
    }

    listenResetClick() {
        ParchisUI.listenResetClick(this.resetGame.bind(this));
    }

    getElegiblePieces(player) {
        return [0, 1, 2, 3].filter(piece => {
            const currentPosition = this.currentPositions[player][piece];

            if (currentPosition === HOME_POSITIONS[player]) {
                return false;
            }

            const diceSum = this.diceValues.reduce((a, b) => a + b, 0);
            if (BASE_POSITIONS[player].includes(currentPosition) && diceSum % 2 !== 0) {
                return false;
            }

            const highestDie = Math.max(...this.diceValues);
            if (HOME_ENTRANCE[player].includes(currentPosition) && highestDie > HOME_POSITIONS[player] - currentPosition) {
                return false;
            }

            return true;
        });
    }

    incrementTurn() {
        // let nextTurn = this.turn;
        // for (let i = 0; i < PLAYERS.length; i++) {
        //     nextTurn = (nextTurn + 1) % PLAYERS.length; // Avanzar al siguiente jugador

        //     const player = PLAYERS[nextTurn];
        //     const elegiblePieces = this.getElegiblePieces(player);
    
        //     if (elegiblePieces.length > 0) {
        //         this.turn = nextTurn;
        //         this.diceValues = [];
        //         this.state = STATE.DICE_NOT_ROLLED;
        //         return;
        //     }
        // }
        this.turn = this.turn === 3 ? 0 : this.turn + 1;
        // Si nadie tiene movimientos posibles, reiniciar los dados y turno
        this.diceValues = [];
        this.state = STATE.DICE_NOT_ROLLED;
    }

    resetGame() {
        this.currentPositions = structuredClone(BASE_POSITIONS);

        PLAYERS.forEach(player => {
            [0, 1, 2, 3].forEach(piece => {
                this.setPiecePosition(player, piece, this.currentPositions[player][piece]);
            });
        });
        this.turn = 0;
        this.diceValues = [];
        this.state = STATE.DICE_NOT_ROLLED;
    }

    listenPieceClick() {
        ParchisUI.listenPieceClick(this.onPieceClick.bind(this));
    }

    onPieceClick(event) {
        const target = event.target;
        if (!target.classList.contains('player-piece')) {
            return;
        }
        const player = target.getAttribute('player-id');
        const piece = target.getAttribute('piece');
        this.handlePieceClick(player, piece);
    }

    handlePieceClick(player, piece) {
        if (player === PLAYERS[this.turn] && this.state === STATE.DICE_ROLLED) {
            const currentPosition = this.currentPositions[player][piece];
            if (BASE_POSITIONS[player].includes(currentPosition)) {
                const diceSum = this.diceValues.reduce((a, b) => a + b, 0);
            
                if (diceSum % 2 !== 0) { // Cambia la lógica si tus reglas son diferentes
                    alert("No puedes salir de la base con este lanzamiento.");
                    return;
                }
            
                this.setPiecePosition(player, piece, START_POSITIONS[player]);
                this.state = STATE.DICE_NOT_ROLLED;
                return;
            }
    
            const diceChoice = parseInt(prompt(`Player ${player}, choose a dice value to move (1: ${this.remainingDiceValues[0]}, 2: ${this.remainingDiceValues[1]})`), 10) - 1;
            const diceValue = this.remainingDiceValues[diceChoice];
    
            this.remainingDiceValues[diceChoice] = undefined;
    
            this.movePiece(player, piece, diceValue);
    
            if (this.remainingDiceValues.every(value => value === undefined)) {
                ParchisUI.unhighlightPieces();
                this.state = STATE.DICE_NOT_ROLLED;
                // this.incrementTurn();
            }
        }
    }

    movePiece(player, piece, moveBy) {
        const interval = setInterval(() => {
            moveBy--;
            this.incrementPiecePosition(player, piece);
    
            if (moveBy === 0) {
                clearInterval(interval);
                if (this.hasPlayerWon(player)) {
                    this.setPiecePosition(player, piece, HOME_POSITIONS[player]);
                    setTimeout(() => {
                        alert(`Player ${player} has won!`);
                        this.resetGame();
                    }, 200);
                    return;
                }
                const isKill = this.checkForKill(player, piece);
                if (isKill || this.remainingDiceValues.includes(6)) {
                    this.state = STATE.DICE_ROLLED;
                    return;
                }
                if (this.remainingDiceValues.every(value => value === undefined)) {
                    this.incrementTurn();
                } else {
                    this.state = STATE.DICE_ROLLED;
                }
            }
        }, 200);
    }

    setPiecePosition(player, piece, newPosition) {
        ParchisUI.setPiecePosition(player, piece, newPosition);
        this.currentPositions[player][piece] = newPosition;
    }

    checkForKill(player, piece) {
        const currentPosition = this.currentPositions[player][piece];
        let kill = false;

        PLAYERS.forEach(opponent => {
            if (opponent !== player) {
                [0, 1, 2, 3].forEach(otherPiece => {
                    const opponentPosition = this.currentPositions[opponent][otherPiece];
                    if (opponentPosition === currentPosition && !SAFE_POSITIONS.includes(opponentPosition)) {
                        this.setPiecePosition(opponent, otherPiece, BASE_POSITIONS[opponent][otherPiece]);
                        kill = true;
                    }
                });
            }
        });

        return kill;
    }

    hasPlayerWon(player) {
        return [0, 1, 2, 3].every(piece => this.currentPositions[player][piece] === HOME_POSITIONS[player]);
    }

    incrementPiecePosition(player, piece) {
        this.setPiecePosition(player, piece, this.getIncrementedPosition(player, piece));
    }

    getIncrementedPosition(player, piece) {
        const currentPosition = this.currentPositions[player][piece];
        if (currentPosition === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0];
        } else if (currentPosition === 67) {
            return 0;
        }
        return currentPosition + 1;
    }
}

function rollTwoDice() {
    const randomIndex1 = Math.floor(Math.random() * 6);
    const randomIndex2 = Math.floor(Math.random() * 6);
    const randomImage1 = diceImages[randomIndex1];
    const randomImage2 = diceImages[randomIndex2];
    const diceImg1 = document.getElementById("diceImg1");
    const diceImg2 = document.getElementById("diceImg2");
  
    diceImg1.classList.add("rotate");
    diceImg2.classList.add("rotate");
  
    setTimeout(() => {
      diceImg1.src = randomImage1;
      diceImg2.src = randomImage2;
      diceImg1.classList.remove("rotate");
      diceImg2.classList.remove("rotate");
    }, 500);
  
    return [randomIndex1, randomIndex2];
}

const parchis = new Parchis();
