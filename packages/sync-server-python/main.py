import asyncio
from websockets.asyncio.server import serve

async def echo(websocket):
    print("Starting echo")
    try:
        async for message in websocket:
            print(message)
            await websocket.send(message)
    finally:
        print("Closing connection")

async def main():
    print("Hello from sync-server-python!")
    server = await serve(echo, "localhost", 8765)
    await server.serve_forever()

if __name__ == "__main__": # True when this file is run directly, e.g. `python main.py`. False when this file is imported into another module.
    asyncio.run(main())

"""
Test with:

let ws = new WebSocket("ws://localhost:8765");
   ws.onmessage = (e) => console.log("got:", e.data);
   ws.onopen = () => ws.send("hello from the browser");

"""