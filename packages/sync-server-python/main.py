import asyncio
from websockets.asyncio.server import serve

async def echo(websocket):
    async for message in websocket:
        await websocket.send(message)

async def main():
    print("Hello from sync-server-python!")
    server = await serve(echo, "localhost", 8765)
    await server.serve_forever()

if __name__ == "__main__": # True when this file is run directly, e.g. `python main.py`. False when this file is imported into another module.
    asyncio.run(main())
