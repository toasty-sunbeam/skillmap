# Yjs sync: learning plan

A staged plan for building the skillmap sync server yourself. Each stage has reading, a
thing to build, and a check that tells you whether you actually understand it yet.

Rule for the whole plan: don't move to the next stage until you can pass its check without
looking anything up. The stages are ordered so each one only needs what came before.

Reference implementations to read, but not copy from yet:

- [yjs/y-protocols](https://github.com/yjs/y-protocols) — the protocol itself, ~5 KB of code
- [yjs/y-websocket-server](https://github.com/yjs/y-websocket-server) — official Node server
- [napolab/y-durableobjects](https://github.com/napolab/y-durableobjects) — Yjs on Cloudflare Durable Objects, the closest match to our target
- [cloudflare/y-partyserver](https://github.com/cloudflare/partykit/tree/main/packages/y-partyserver) — Cloudflare's own take

Keep those closed until the stage that names them. Reading a finished implementation before
you've tried the problem teaches you the shape of their solution, not the shape of the problem.

---

## Stage 0: the three primitives

**Read**

- [Document updates](https://docs.yjs.dev/api/document-updates) — the whole page. This is the most important page in the plan.
- [Y.Doc API](https://docs.yjs.dev/api/y.doc) — skim, then read the `update` event and `transact` sections closely.

**Build**

Reproduce `docs/yjs-sync-playground.html` from scratch as a plain script, no HTML. Two
`Y.Doc`s in one file. Make edits on both, sync them by hand with
`encodeStateVector` / `encodeStateAsUpdate` / `applyUpdate`, and print byte sizes at each step.

**Check**

Answer these without running code:

1. Why does `Y.encodeStateAsUpdate(doc, sv)` need the state vector argument at all?

It doesn't. If you omit the sv argument, it will compare its current state against an empty document. This will waste space, computation, and bandwidth, but it will work. The sv argument gives you a state to compare against so your updates will be small and efficient.

2. A client has been offline for a week. What travels first when it reconnects, and roughly how big is it?

The first thing to travel is its state vector, which is just a client ID and a clock number for each client.

3. You apply the same update three times. What happens, and why is that not a bug?

Nothing happens. Each update carries a clientId and a clock; clients will see the update has already been applied and skip it.

4. Two peers each hold updates the other lacks. How many messages minimum to converge, and why isn't it one?

A messages B with its state vector. B replies with a state vector and its update. A applies the update, computes a new update, and sends it to B.

**Watch out**

`doc.clientID` is random per `Y.Doc` instance. If you set it manually to get reproducible
results, never do that in production. Two peers sharing a clientID corrupts the document.

---

## Stage 1: what a clock actually counts

**Read**

- [Working with shared types](https://docs.yjs.dev/getting-started/working-with-shared-types)
- [Y.Map](https://docs.yjs.dev/api/shared-types/y.map) — specifically what happens on concurrent `set` of the same key
- [Yjs FAQ](https://docs.yjs.dev/api/faq) — the conflict-resolution entries

**Build**

Write a script that prints `Y.decodeStateVector(...)` after each individual operation, so you
watch the clock increment. Then wrap several operations in one `doc.transact()` and print again.

**Check**

1. What does the number in `{1001: 12}` count? Operations? Bytes? Transactions? Something else?
2. Does wrapping edits in `transact` change the final clock value? Does it change the number of `update` events fired?
3. Why does a state vector have one entry per client rather than one number overall?
4. Two peers write different keys on the same `Y.Map` concurrently. Do both survive? What about the same key?

**Watch out**

"Last writer wins" in Yjs means highest clientID wins, not most recent in wall-clock time.
Nothing in a Yjs document knows what time it is.

---

## Stage 2: the wire protocol

**Read**

- [y-protocols/PROTOCOL.md](https://github.com/yjs/y-protocols/blob/master/PROTOCOL.md) — the spec, 6 KB
- [y-protocols/src/sync.js](https://github.com/yjs/y-protocols/blob/master/src/sync.js) — the implementation, 5 KB. Read every line; it's short enough.
- [dmonad/lib0](https://github.com/dmonad/lib0) — just the `encoding` / `decoding` README sections. This is the varint binary codec Yjs uses.

**Build**

Encode and decode sync messages by hand with `lib0`, no `y-protocols` import. Write
`writeSyncStep1`, `writeSyncStep2`, `readSyncMessage` yourself against the spec. Then diff your
version against `sync.js` and account for every difference.

**Check**

1. What are the three sync message types, and which direction does each travel?
2. Why does the connecting client send step 1 *and* the server send its own step 1? Why isn't one enough?
3. `messageYjsUpdate` and `messageYjsSyncStep2` both carry an update. Why are they distinct types?
4. What's the outer envelope in y-websocket that distinguishes a sync message from an awareness message?

**Watch out**

Two layers of framing are easy to conflate. y-websocket has an outer message type
(sync vs awareness vs auth), and *inside* a sync message there's a second type byte
(step1 vs step2 vs update). Draw the byte layout on paper before you write the decoder.

---

## Stage 3: Durable Objects, without Yjs

**Read**

- [Durable Objects overview](https://developers.cloudflare.com/durable-objects/)
- [Using WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/) — read the whole page twice. The hibernation section is the part that will bite you.
- [DurableObject state](https://developers.cloudflare.com/durable-objects/api/state/)
- [Limits](https://developers.cloudflare.com/durable-objects/platform/limits/) — find the per-value storage limit and write it down

**Build**

In `packages/sync-server`, a DO that has nothing to do with Yjs: accept WebSocket connections,
keep a list of them, and broadcast any received text message to every other connection. Test
with two browser tabs.

**Check**

1. What's the difference between `new WebSocketPair()` plus `acceptWebSocket()` and plain `accept()`? Which one enables hibernation?
2. Your DO hibernates and later wakes. Which in-memory variables survive? What does that imply for holding a `Y.Doc` in memory?
3. How does a request pick *which* DO instance it talks to? Where does that happen in our current [src/index.ts](../packages/sync-server/src/index.ts)?
4. What's the maximum size of a single stored value, and what does that mean for `encodeStateAsUpdate` on a large tree?

**Watch out**

Hibernation is the thing people get wrong. If you keep a `Y.Doc` in an instance field and rely
on it surviving, it works in dev and fails in production once the DO evicts. Decide early
whether you rehydrate from storage on every wake.

---

## Stage 4: the sync server

**Read**

Now open the reference implementations, in this order:

- [y-websocket-server/src/utils.js](https://github.com/yjs/y-websocket-server/blob/main/src/utils.js) — the canonical server loop, 9 KB
- [y-durableobjects/src/yjs/index.ts](https://github.com/napolab/y-durableobjects/blob/main/src/yjs/index.ts) — the same job on our platform, 4 KB

**Build**

Combine stages 2 and 3. The DO holds a `Y.Doc`, completes the handshake with each connecting
client, applies incoming updates, and broadcasts them onward. No persistence yet, no awareness.
Point the app at it with a client provider.

**Check**

1. When an update arrives, why can you broadcast the received bytes verbatim instead of recomputing a diff per client?
2. Why must you not echo an update back to the peer that sent it, and what happens if you do?
3. A third client joins while two are mid-edit. Walk through every message exchanged.
4. Where does `doc.on('update')` fire on the server, and how do you avoid an infinite loop when applying a remote update?

**Watch out**

The origin argument to `applyUpdate(doc, update, origin)` is how you tell "this came from the
network" apart from "this was a local edit". Skip it and you'll rebroadcast updates in a loop.

---

## Stage 5: persistence

**Read**

- [DO Storage API](https://developers.cloudflare.com/durable-objects/api/storage-api/)
- [SQL storage](https://developers.cloudflare.com/durable-objects/api/sql-storage/) — our [wrangler.jsonc](../packages/sync-server/wrangler.jsonc) already declares `new_sqlite_classes`, so this backend is available

**Build**

Survive a DO restart. Store the document, reload on wake, and confirm a client that reconnects
after eviction still sees its data.

**Check**

1. Storing one blob via `encodeStateAsUpdate` versus appending an update log: what does each cost on read, on write, and on storage?
2. If you append updates forever, what breaks first? What's the compaction trigger?
3. Given the per-value limit from stage 3, at what document size does the single-blob approach fail, and what do you do then?
4. Do you need to persist on every update, or can you debounce? What's the failure mode of debouncing?

**Watch out**

Never persist awareness state. It's presence data about live connections; writing it means
storing ghosts of users who left.

---

## Stage 6: awareness

**Read**

- [Adding awareness](https://docs.yjs.dev/getting-started/adding-awareness)
- [About awareness](https://docs.yjs.dev/api/about-awareness)
- [y-protocols/src/awareness.js](https://github.com/yjs/y-protocols/blob/master/src/awareness.js)

**Build**

Cursors or selection highlights for other users on the skill grid.

**Check**

1. Why is awareness a separate protocol rather than another field on the document?
2. What removes a user's awareness state when they close the tab without a clean disconnect?
3. Why does awareness use its own clock, and what happens on a clock conflict?

---

## Stage 7: our actual schema

This one is specific to skillmap and can't be answered by reading Yjs docs.

**Build**

Fix the problems the playground demonstrates.

1. Convert `edges` from `Y.Array` to a `Y.Map` keyed by the canonical edge key. See [state/edge.ts](../packages/app/src/lib/state/edge.ts) and [state/document.ts](../packages/app/src/lib/state/document.ts). Concurrent identical inserts then collapse to one entry.
2. Decide what to do about dangling edges, where one peer deletes a node while another connects to it. Filtering at read time in [grid.svelte](../packages/app/src/lib/grid.svelte) is the usual answer.
3. Decide whether `points` needs to be something other than a plain number. Concurrent increments currently lose one.
4. Migrate or reset existing IndexedDB data, since the `edges` type changes.

**Check**

1. Which fields in our schema can silently lose a write, and is that acceptable for each?
2. Two tabs open on the same tree with only `y-indexeddb`, no server. Which of these bugs can already happen today?
3. What invariant does `normalizeEdge` guarantee, and why does the `Y.Map` fix depend on it?

---

## Suggested pacing

Stages 0 through 2 are the conceptual core and worth real time. Stage 3 is platform mechanics
and mostly reading. Stage 4 is where it becomes a working system, and it's much smaller than it
looks once 0 through 3 are solid.

Stage 7 is independent of the rest. It's worth doing early, because those bugs exist right now
in the two-tab case, before any server is involved.
