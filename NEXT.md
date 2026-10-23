# NEXT: Session 2 (Monday morning block)

**Last time:** Finished the echo server (milestone 1). It prints a line on connect and in a `finally` block on disconnect. Exercism done: Basics, Numbers, Bools, Conditionals, Comparisons.
**Stopped at:** `echo()` in `packages/sync-server-python/main.py`. It works. Killing the Firefox tab process printed no traceback. You decided not to catch `ConnectionClosed`.
**First step, no decisions needed:** open `main.py` and read the `ServerConnection` docs ("new asyncio" page) for how to get the request path.

## This session's goal
Milestone 2: **rooms.** The URL path picks the room (`ws://localhost:8765/room-a`). Open two tabs on the same room, and a message sent in one shows up in the other. A tab in a different room sees nothing.

Done when you can show that with two tabs in `room-a` and one in `room-b`.

## Steps
1. Find out how to read the request path from the connection object (`ServerConnection` docs, "new asyncio" page).
2. Keep a module-level `dict` that maps a room name to a `set` of connections.
3. On connect, add the connection to its room. On disconnect, remove it. Put the removal in `finally`.
4. On each message, send it to every other connection in the same room.
5. Decide what to do when a room becomes empty (delete it, or leave it).
6. Add one pytest test for the room logic. Ask Claude about `pytest-asyncio` when you reach this.
7. Exercise reps: do the next unlocked Exercism exercises (lists, tuples, dicts). Aim for 45 minutes.

## New things you'll meet
- `dict` and `set` (like `Map` and `Set` in JS), and `dict.setdefault`
- `asyncio.gather` or `websockets.broadcast` for sending to many clients
- `set.discard` vs. `set.remove`
- Type hints on function signatures, such as `dict[str, set[ServerConnection]]`
- `pytest` and `pytest-asyncio`

## Before you stop
Ask Claude to rewrite this file for the next session.
