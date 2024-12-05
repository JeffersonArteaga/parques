//positions but starting from part poin house blue

import { playerID } from './selectCorner.js';

export const COORDINATES_MAP = {
    0: [59.5, 19.3], // punto partida casa azul
    1: [59.5, 23.9],
    2: [59.5, 28.6],
    3: [59.5, 33.5],
    4: [63.4, 37],
    5: [68.2, 37],
    6: [72.7, 37],
    7: [77.5, 37], // seguro casa azul
    8: [82.2, 37],
    9: [86.8, 37],
    10: [91.5, 37],

    11: [96.1, 37],
    12: [96.1, 48.7], // Entrada segura casa roja
    13: [96.1, 60.2],

    14: [91.5, 60.2],
    15: [86.8, 60.2],
    16: [82.2, 60.2],
    17: [77.5, 60.2], // punto partida casa roja
    18: [72.7, 60.2],
    19: [68.2, 60.2],
    20: [63.4, 60.2],

    21: [59.5, 63.8],
    22: [59.5, 68.3],
    23: [59.5, 73],
    24: [59.5, 77.7], // seguro casa roja
    25: [59.5, 82.4],
    26: [59.5, 87],
    27: [59.5, 91.7],

    28: [59.5, 96.4],
    29: [48.3, 96.4], // Entrada segura casa verde
    30: [36.7, 96.4],

    31: [36.7, 91.7],
    32: [36.7, 87],
    33: [36.7, 82.4],
    34: [36.7, 77.7], // punto partida casa verde
    35: [36.7, 73],
    36: [36.7, 68.3],
    37: [36.7, 63.8],

    38: [33.2, 60.2],
    39: [28.5, 60.2],
    40: [23.9, 60.2],
    41: [19.3, 60.2], // seguro casa verde
    42: [14.5, 60.2],
    43: [9.7, 60.2],
    44: [5.1, 60.2],

    45: [0.5, 60.2],
    46: [0.5, 48.7], // Entrada segura casa amarilla
    47: [0.5, 37],

    48: [5.1, 37],
    49: [9.7, 37],
    50: [14.5, 37],
    51: [19.3, 37], // punto partida casa amarilla
    52: [23.9, 37],
    53: [28.5, 37],
    54: [33.2, 37],

    55: [36.7, 33.5],
    56: [36.7, 28.6],
    57: [36.7, 23.9],
    58: [36.7, 19.3], // seguro casa amarilla
    59: [36.7, 14.7],
    60: [36.7, 10],
    61: [36.7, 5.4],

    62: [36.7, 0.8],
    63: [48.3, 0.8], // Entrada segura casa azul
    64: [59.5, 0.8],

    65: [59.5, 5.4],
    66: [59.5, 10],
    67: [59.5, 14.7],

    // home entrance

    // Casa azul [48.3, 0.8]
    630: [48.3, 0.8],
    631: [48.3, 5.4],
    632: [48.3, 10],
    633: [48.3, 14.7],
    634: [48.3, 19.3],
    635: [48.3, 23.9],
    636: [48.3, 28.6],
    637: [48.3, 33.5],
    638: [48.3, 40],

    // Casa roja [96.1, 48.7]
    120: [96.1, 48.7],
    121: [91.5, 48.7],
    122: [86.8, 48.7],
    123: [82.2, 48.7],
    124: [77.5, 48.7],
    125: [72.7, 48.7],
    126: [68.2, 48.7],
    127: [63.4, 48.7],
    128: [56, 48.7],

    // Casa verde [48.3, 96.4]
    290: [48.3, 96.4],
    291: [48.3, 91.7],
    292: [48.3, 86.8],
    293: [48.3, 82.2],
    294: [48.3, 77.5],
    295: [48.3, 72.7],
    296: [48.3, 68.2],
    297: [48.3, 63.4],
    298: [48.3, 56],

    // Casa amarilla 46: [0.5, 48.7]
    460: [0.5, 48.7],
    461: [5.1, 48.7],
    462: [9.7, 48.7],
    463: [14.5, 48.7],
    464: [19.3, 48.7],
    465: [23.9, 48.7],
    466: [28.6, 48.7],
    467: [33.5, 48.7],
    468: [40, 48.7],

    // player bases

    // Blue P1
    600: [87, 10],
    601: [87, 20],
    602: [77, 10],
    603: [77, 20],

    // Green P2
    200: [10, 87],
    201: [20, 87],
    202: [10, 77],
    203: [20, 77],
    
    // Yellow P3
    400: [10, 10],
    401: [10, 20],
    402: [20, 10],
    403: [20, 20],

    // Red P4
    100: [87, 87],
    101: [87, 77],
    102: [77, 87],
    103: [77, 77],
};

export const STEP_WIDTH = 11.67;
export const STEP_HEIGHT = 4.6;

export const PLAYERS = [ 'P1', 'P2', 'P3', 'P4']; 


export const BASE_POSITIONS = {
    P1: [600, 601, 602, 603],
    P2: [200, 201, 202, 203],
    P3: [400, 401, 402, 403],
    P4: [100, 101, 102, 103],
}

export const START_POSITIONS = {
    P1: 0, // punto partida casa azul
    P2: 34,// punto partida casa verde
    P3: 51,// punto partida casa amarilla
    P4: 17,// punto partida casa roja
}

export const HOME_ENTRANCE = {
    P1: [630, 631, 632, 633, 634, 635, 636, 637],
    P2: [290, 291, 292, 293, 294, 295, 296, 297],
    P3: [460, 461, 462, 463, 464, 465, 466, 467],
    P4: [120, 121, 122, 123, 124, 125, 126, 127],
}

export const HOME_POSITIONS = {
    P1: 638,
    P2: 298,
    P3: 468,
    P4: 128,
}

export const TURNING_POINTS = {
    P1: 63,
    P2: 29,
    P3: 46,
    P4: 12,
};

export const SAFE_POSITIONS = [0, 7, 12, 17, 24, 29, 34, 41, 46, 51, 58, 63];

export const STATE = {
    DICE_NOT_ROLLED: 'DICE_NOT_ROLLED',
    DICE_ROLLED: 'DICE_ROLLED',
    FINISHED: 'FINISHED',
}

export const diceImages = [
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Alea_1.png", // Face 1
    "https://upload.wikimedia.org/wikipedia/commons/b/b8/Alea_2.png", // Face 2
    "https://upload.wikimedia.org/wikipedia/commons/2/2f/Alea_3.png", // Face 3
    "https://upload.wikimedia.org/wikipedia/commons/8/8d/Alea_4.png", // Face 4
    "https://upload.wikimedia.org/wikipedia/commons/5/55/Alea_5.png", // Face 5
    "https://upload.wikimedia.org/wikipedia/commons/f/f4/Alea_6.png" // Face 6
  ];