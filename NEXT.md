# NEXT: Session 1 (Wednesday morning block)

**Goal:** break the seal. By the end, Python is installed, you've done a few Exercism exercises by hand, and a tiny WebSocket server answers your browser.

**Rule for every session:** you type every line. Claude explains, hints and reviews. If you're stuck for 10 minutes, ask for a hint, not the answer.

**First step, no decisions needed:** open a terminal and install uv.

---

## Part 1: Toolchain (~30 min)

1. Install uv: https://docs.astral.sh/uv/getting-started/installation/
   Check: `uv --version`
2. Install Python: `uv python install`
   Check: `uv run python --version`
3. Exercism:
   - Make an account at exercism.org and join the **Python** track.
   - Install the Exercism CLI (the track page links it).
   - Run `exercism configure --token=<your token>`. The token is on your Exercism settings page.

## Part 2: Exercism warm-up (~60 min, stop at the hour wherever you are)

Do the learning exercises in the order the track unlocks them. The first few are usually:

- `guidos-gorgeous-lasagna` (functions, docstrings)
- `ghost-gobble-arcade-game` (booleans)
- `little-sisters-vocab` (strings)
- `meltdown-mitigation` (conditionals)

The loop for each one:

1. `exercism download --track=python --exercise=<slug>`
2. Open the folder and read `README.md`.
3. Write your solution by hand.
4. Run `uvx pytest` inside the exercise folder until it's green.
5. `exercism submit <file>.py`

## Part 3: WebSocket echo server (~60 min)

1. In the talent tree repo, make a folder for the server (`server/` or whatever fits). Inside it, run:
   ```
   uv init
   uv add websockets
   ```
2. Write `main.py`: an async server on `localhost:8765` that sends back whatever it receives.
   Docs: https://websockets.readthedocs.io (Getting started; use the `websockets.asyncio.server` API).
3. Run it: `uv run main.py`
4. Test from any browser's dev console:
   ```js
   const ws = new WebSocket("ws://localhost:8765");
   ws.onmessage = (e) => console.log("got:", e.data);
   ws.onopen = () => ws.send("hello from the browser");
   ```

**Done when** the console prints `got: hello from the browser`.

New things you'll meet here (ask Claude about any of them): `async def`, `await`, `asyncio.run()`, `async for`, `if __name__ == "__main__":`

**Stretch, if time is left:** print a line on the server when a client connects and when it disconnects.

---

## Before you stop

Ask Claude to rewrite this file for Session 2: what you finished, where you stopped, and the first concrete step for next time.

Next milestone after this one: **rooms.** Open two browser tabs; a message sent in one shows up in the other.

Breaks: a 3-hour block has room for two breaks. On lift days, use the break cards.
