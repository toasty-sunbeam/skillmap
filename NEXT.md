# NEXT: Session 3 (Wednesday morning block)

**Last time:** The server now serves `client.html` too. `process_request` checks the `Upgrade` header. Plain page loads get the HTML with a `text/html` content type. WebSocket requests go on to `echo()`. You also learned `breakpoint()`/pdb, type hints with Pylance, and `logging.basicConfig`.
**Stopped at:** `packages/sync-server-python/rooms.py`. Echo works from the browser client at `http://localhost:8765/room-a`. There are no rooms yet: every tab only hears its own echo.
**First step, no decisions needed:** in `echo()`, print the request path from the connection. Open `/room-a` and `/room-b` in two tabs and check that the terminal shows both paths.

## This session's goal
Milestone 2: **rooms.** The URL path picks the room. Open two tabs on the same room, and a message sent in one shows up in the other. A tab in a different room sees nothing.

Done when you can show that with two tabs in `room-a` and one in `room-b`.

## Steps
1. Quick cleanup from last session's review:
   - `main()` is indented with tabs and the rest of the file uses spaces. Run `uvx ruff format rooms.py` and see what else it changes.
   - Rename `upgradeHeader` to `upgrade_header`. Python uses snake_case for variables and functions.
   - Move `logging.basicConfig(...)` into `main()`. At module level it runs on import, and your pytest test will import this file.
2. Print the request path (the first step above).
3. Keep a module-level `dict` that maps a room name to a `set` of connections.
4. On connect, add the connection to its room. On disconnect, remove it. Put the removal in `finally`.
5. On each message, send it to every other connection in the same room. Change `client.html`'s "got:" lines if they get confusing (Claude can do that).
6. Decide what to do when a room becomes empty: delete it, or leave it.
7. Add one pytest test for the room logic. Ask Claude about `pytest-asyncio` when you reach this.
8. Exercism reps: do the next unlocked exercises (lists, tuples, dicts). Aim for 45 minutes.

## New things you'll meet
- `dict` and `set` (like `Map` and `Set` in JS), and `dict.setdefault`
- `asyncio.gather` or `websockets.broadcast` for sending to many clients
- `set.discard` vs. `set.remove`
- Type hints with generics, such as `dict[str, set[ServerConnection]]`
- `pytest` and `pytest-asyncio`
- Optional: `http.HTTPStatus.OK` instead of `200`, and `Path(__file__).parent` so `client.html` loads from any working directory

## Before you stop
Ask Claude to rewrite this file for the next session.
