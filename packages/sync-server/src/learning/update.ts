import * as Y from 'yjs';

const doc = new Y.Doc();
const text = doc.getText('text');
const array = doc.getArray('array');
const map = doc.getMap('map');

function logStateVector() {
	const sv = Y.encodeStateVector(doc);
	console.log(Y.decodeStateVector(sv));
}

map.observe(event => {
	console.log('changes', event.changes)
})

doc.transact(() => {
	map.set('a', 'first value')
})
logStateVector();