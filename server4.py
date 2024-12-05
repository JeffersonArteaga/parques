import asyncio
import websockets
import json

# Lista de colores disponibles
available_colors = ["ROJO", "AZUL", "VERDE", "AMARILLO"]
connected_clients = {}  # Diccionario para guardar los jugadores conectados
waiting_clients = []  # Lista de espera para clientes adicionales
MAX_CLIENTS = 4  # Máximo número de clientes conectados al mismo tiempo
game_state = False

async def handle_client(websocket):
    try:
        # Manejar límite de conexiones
        if len(connected_clients) >= MAX_CLIENTS:
            # Agregar al cliente a la lista de espera
            waiting_clients.append(websocket)
            await websocket.send(json.dumps({
                "type": "wait",
                "message": "El juego está lleno. Estás en la lista de espera."
            }))
            print(f"Cliente añadido a la lista de espera: {websocket.remote_address}")
            return

        # Registrar al cliente en la lista de conectados
        connected_clients[websocket] = {"playerId": None, "color": None, "username": None}
        print(f"Cliente conectado: {websocket.remote_address}")

        # Enviar lista de colores disponibles al conectarse
        await websocket.send(json.dumps({
            "type": "availableColors",
            "colors": available_colors
        }))

        # Mensaje de bienvenida
        await websocket.send(json.dumps({
            "type": "welcome",
            "message": "Bienvenido al juego. Selecciona un color."
        }))

        while True:
            # Recibir mensaje del cliente
            message = await websocket.recv()
            data = json.loads(message)
            print(data)

            if data["type"] == "colorSelection":
                player_id = data["playerId"]
                color = data["color"]
                username = data["username"]

                # Verificar si el color está disponible
                if color in available_colors:
                    # Reservar el color y registrar al jugador
                    available_colors.remove(color)
                    connected_clients[websocket] = {"playerId": player_id, "color": color, "username": username}

                    # Confirmar al cliente
                    await websocket.send(json.dumps({
                        "type": "colorConfirmation",
                        "message": f"Has seleccionado el color {color} exitosamente."
                    }))

                    # Notificar a todos los clientes conectados la nueva lista de colores disponibles
                    await notify_all_clients()
                    print(f"Cliente {websocket.remote_address} seleccionó el color {color}.")
                else:
                    # Informar al cliente que el color no está disponible
                    await websocket.send(json.dumps({
                        "type": "error",
                        "message": f"El color {color} no está disponible. Por favor, selecciona otro."
                    }))

            elif data["type"] == "getAvailableColors":
                # Enviar la lista de colores disponibles
                await websocket.send(json.dumps({
                    "type": "availableColors",
                    "colors": available_colors
                }))

            elif data["type"] == "getConnectedPlayers":
                # Enviar la lista de jugadores conectados                
                players = [
                    {"username": info["username"], "color": info["color"], "playerId": info["playerId"]}
                    for info in connected_clients.values() if info["username"]
                ]
                
                await websocket.send(json.dumps({
                    "type": "connectedPlayers",
                    "players": players
                }))

            elif data["type"] == "startGame":
                global game_state
                game_state = True
                await websocket.send(json.dumps({
                    "type": "getGameState",
                    "state": game_state
                }))
            elif data["type"] == "getGameState":
                await websocket.send(json.dumps({
                    "type": "getGameState",
                    "state": game_state
                }))

    except websockets.exceptions.ConnectionClosed:
        # Manejo de desconexión
        print(f"Cliente desconectado: {websocket.remote_address}")
        if websocket in connected_clients:
            player = connected_clients.pop(websocket)
            if player["color"]:
                available_colors.append(player["color"])  # Liberar el color
                print(f"Color {player['color']} liberado.")

        # Manejar lista de espera
        if waiting_clients:
            next_client = waiting_clients.pop(0)
            print(f"Cliente de la lista de espera conectado: {next_client.remote_address}")
            await handle_client(next_client)


async def notify_all_clients():
    """Notifica a todos los clientes la lista actualizada de colores disponibles."""
    colors_update = json.dumps({
        "type": "availableColors",
        "colors": available_colors
    })
    for client in connected_clients:
        try:
            await client.send(colors_update)
        except websockets.exceptions.ConnectionClosed:
            # Ignorar errores de conexión cerrada al notificar
            pass


# Ajusta la configuración del servidor
async def main():
    print("Servidor iniciado en ws://127.0.0.1:12345")
    async with websockets.serve(handle_client, "127.0.0.1", 12345):
        await asyncio.Future()  # Mantener el servidor ejecutándose

if __name__ == "__main__":
    asyncio.run(main())
