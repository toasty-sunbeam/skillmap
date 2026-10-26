import asyncio
import pathlib
from websockets.asyncio.server import serve, ServerConnection
from websockets.http11 import Request, Response

import logging
logging.basicConfig(level=logging.INFO)

async def echo(websocket):
    try:
        async for message in websocket:
            print(message)
            await websocket.send(message)
    finally:
        print("Closing connection")

# Intercept regular HTTP pageloads and send the HTTP client instead of a websocket connection
def process_request(connection: ServerConnection, request: Request) -> Response | None:
    upgradeHeader = request.headers.get("Upgrade")
    if upgradeHeader == "websocket":
        return None # Cancel the intercept and continue with websockets
    
    # Serve the web client
    html = pathlib.Path("client.html").read_text()
    response = connection.respond(200, html)
    del response.headers["Content-Type"] # delete text/plain
    response.headers["Content-Type"] = "text/html"
    return response

async def main():
	print("Starting server")
	server = await serve(echo, "localhost", 8765, process_request=process_request)
	await server.serve_forever()

if __name__ == "__main__": # True when this file is run directly, e.g. `python hello-world.py`. False when this file is imported into another module.
    asyncio.run(main())
