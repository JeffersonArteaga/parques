
const creators = document.querySelectorAll('.creator');
const confirmButton = document.getElementById('confirmButton');
const startButton = document.getElementById('startGameButton');
const message = document.getElementById('message');
const gameBoard = document.querySelector('.game-container'); // El tablero del juego
const endButton = document.getElementById('endButton'); // El botón de terminar juego

// Estado de los jugadores y las esquinas
let selectedPlayer = null;
let gameStarted = false; // Estado para saber si el juego ha iniciado
const selectedPlayers = new Set(); // Guardará los IDs de los jugadores confirmados
export let socket = null; // WebSocket para comunicarse con el servidor
let availableColors = []; // Colores disponibles recibidos del servidor
let username = null;
export let globalPlayerList = [];
let game_state = false
export let playerID;

// Conectar al servidor usando WebSocket
function connectToServer() {
    socket = new WebSocket("https://ssnbt34f-12345.brs.devtunnels.ms");

    socket.onopen = () => {
        console.log("Conectado al servidor.");
        message.textContent = "Conectado al servidor. Obteniendo colores disponibles...";

        // Solicitar nombre de usuario
        username = prompt("Por favor, introduce tu nombre de usuario:");
        if (!username) {
            alert("No se puede continuar sin un nombre de usuario.");
            socket.close();
            return;
        }

        socket.send(JSON.stringify({
            type: "getConnectedPlayers"
        }));

        // Solicitar colores disponibles al servidor
        socket.send(JSON.stringify({
            type: "getAvailableColors"
        }));

        // Comenzar la actualización periódica de jugadores conectados
        fetchConnectedPlayersPeriodically();
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "availableColors") {
            // Actualizar los colores disponibles
            availableColors = data.colors;
            console.log("Colores disponibles:", availableColors);
            if (selectedPlayers.size == 0) {
                updateColorStart();
            }

            message.textContent = "Selecciona tu esquina de los colores disponiblesss.";
        } else if (data.type === "colorConfirmation") {
            message.textContent = data.message;

            // Marcar el color seleccionado como ocupado
            const creator = Array.from(creators).find(c => c.getAttribute('color') === selectedPlayer.color);
            if (creator) {
                creator.classList.add('occupied');
            }

            selectedPlayers.add(selectedPlayer.id);
            updateColorOptions();
        } else if (data.type === "connectedPlayers") {
            // Actualizar la lista de jugadores conectados
            console.log("Jugadores conectados:", data.players);
            
            updatePlayerList(data.players);
        } else if (data.type === "error") {
            alert(data.message);
        } else if (data.type === "getGameState") {
            game_state = data.state;
            console.log("Estado del juego:", game_state);
            if (game_state) {
                startGame();
            }
        }
        

    };

    socket.onclose = () => {
        console.log("Desconectado del servidor.");
        message.textContent = "Desconectado del servidor.";
    };

    socket.onerror = (error) => {
        console.error("Error en el WebSocket:", error);
        message.textContent = "Error al conectar con el servidor.";
    };
}

creators.forEach(creator => {
    creator.addEventListener('click', () => {
        // Si la esquina ya está ocupada o si el juego ya ha comenzado, no permitir la selección
        if (creator.classList.contains('occupied') || gameStarted) {
            alert("Esta esquina ya ha sido seleccionada o el juego ya ha comenzado.");
            return;
        }

        // Si ya hay un jugador seleccionado, desmarcarlo
        creators.forEach(c => c.classList.remove('selected'));

        // Marcar la esquina seleccionada
        creator.classList.add('selected');

        selectedPlayer = {
            id: creator.getAttribute('player-id'),
            color: creator.getAttribute('color')
        };

        confirmButton.disabled = false;
    });
});

confirmButton.addEventListener('click', () => {
    if (selectedPlayer && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: "colorSelection",
            playerId: selectedPlayer.id,
            color: selectedPlayer.color,
            username: username
        }));

        // Bloquear todas las esquinas después de la selección de color
        creators.forEach(creator => {
            const color = creator.getAttribute('color');
            if (!availableColors.includes(color)) {
                creator.classList.add('occupied');
                creator.style.pointerEvents = 'none'; // Bloquear la interacción
            }
        });

        confirmButton.disabled = true;
    } else {
        alert("Error: No se pudo enviar el color al servidor. Verifica tu conexión.");
    }
});

function getConnectedPlayerIds() {
    return globalPlayerList.map(player => player.playerId);
}


function updateColorOptions() {
    // Deshabilitar todas las esquinas que no estén disponibles
    creators.forEach(creator => {
        const color = creator.getAttribute('color');
        console.log(color);
        creator.classList.add('occupied');
        creator.style.pointerEvents = 'none'; // Bloquear la interacción
    });
}

function updateColorStart() {
    // Bloquear las esquinas cuyos colores no estén en la lista disponible
    creators.forEach(creator => {
        const color = creator.getAttribute('color');
        console.log(color);
        if (!availableColors.includes(color)) {
            // Bloquear la interacción y marcar como ocupado
            creator.classList.add('occupied');
            creator.style.pointerEvents = 'none';
        } else {
            // Habilitar la interacción y quitar la marca de ocupado
            creator.classList.remove('occupied');
            creator.style.pointerEvents = 'auto';
        }
    });
}


export function updatePlayerList(players) {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = ''; // Limpiar lista actual

    
    
    globalPlayerList = players;
    console.log(globalPlayerList)
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.username} (${player.color})`;
        playersList.appendChild(listItem); 
    });

    const playersList2 = document.getElementById('playersList2');   
    playersList2.innerHTML = ''; // Limpiar lista actual

    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.username} (${player.color})`;
        playersList2.appendChild(listItem); 
    });

    // Verificar si hay al menos dos jugadores conectados
    if (globalPlayerList.length >= 2) {
        startButton.disabled = false; // Habilitar el botón
        message.textContent = "Listo para comenzar. ¡Al menos dos jugadores están conectados!";
    } else {
        startButton.disabled = true; // Deshabilitar el botón
        message.textContent = "Esperando al menos dos jugadores para iniciar el juego.";
    }

    playerID = getConnectedPlayerIds();
    console.log(playerID);
}

function fetchConnectedPlayersPeriodically() {
    // Enviar solicitud al servidor para obtener la lista de jugadores conectados
    if (socket && socket.readyState === WebSocket.OPEN ) {
        socket.send(JSON.stringify({
            type: "getConnectedPlayers"
        }));

        socket.send(JSON.stringify({
            type: "getGameState"
        }));

    }

    // Configurar el próximo fetch después de un intervalo
    setTimeout(fetchConnectedPlayersPeriodically, 2000); // Actualizar cada 5 segundos
}


startButton.addEventListener('click', () => {
    if (globalPlayerList.length >= 1) {
        //message.textContent = "El juego ha comenzado con " + selectedPlayers.size + " jugadores.";
        socket.send(JSON.stringify({
            type: "startGame"
        }));
        startGame();
    }
});

function startGame() {
    gameStarted = true;
    startButton.textContent = "Terminar Juego";
    confirmButton.disabled = true;
    //gameBoard.style.display = 'block';
    gameBoard.style.display = 'flex';
    document.querySelector('section').style.display = 'none';
    message.textContent = "El juego ha comenzado, ¡que comience la acción!";
}

function endGame() {
    gameStarted = false;
    startButton.textContent = "Iniciar Juego";
    selectedPlayers.clear();
    startButton.disabled = true;
    creators.forEach(creator => {
        creator.classList.remove('occupied');
        creator.classList.remove('selected');
    });
    gameBoard.style.display = 'none';
    document.querySelector('section').style.display = 'block';
    message.textContent = "Selecciona tu esquina para comenzar el juego.";
}

endButton.addEventListener('click', () => {
    endGame();
});

message.textContent = "Selecciona tu esquina para empezar.";
 // Llamada para establecer la conexión al servidor
 connectToServer();

