import * as Y from 'yjs';

const doc1 = new Y.Doc();
const doc2 = new Y.Doc();
const text1 = doc1.getText('');
const text2 = doc2.getText('');

text1.insert(0, 'Learning project');

const update = Y.encodeStateAsUpdate(doc1);
const stateVector = Y.encodeStateVector(doc1);

console.log("Before, text1", text1.toJSON())
console.log("Before, text2", text2.toJSON())
Y.applyUpdate(doc2, update);
console.log("After, text1", text1.toJSON())
console.log("After, text2", text2.toJSON())