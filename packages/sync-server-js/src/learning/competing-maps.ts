import * as Y from 'yjs';

const client1 = new Y.Doc();
const client2 = new Y.Doc();
const map1 = client1.getMap();
const map2 = client2.getMap();

map1.set('a', 'Value A');
map2.set('a', 'Value B');

const update = Y.encodeStateAsUpdate(client1);
Y.applyUpdate(client2, update);

console.log(map2.toJSON());