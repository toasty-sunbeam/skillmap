import * as Y from 'yjs';

const doc1 = new Y.Doc();
const doc2 = new Y.Doc();
const text1 = doc1.getText('text');
const text2 = doc2.getText('text');

text1.insert(0, 'Learning project');
console.log("INIITAL:")
console.log("text1", text1.toJSON())
console.log("text2", text2.toJSON())
console.log("---")

const sv2 = Y.encodeStateVector(doc2);
const update = Y.encodeStateAsUpdate(doc1, sv2);
Y.applyUpdate(doc2, update);
Y.logUpdate(update)

console.log("FIRST UPDATE:");
console.log("text1", text1.toJSON())
console.log("text2", text2.toJSON())
console.log("---")

text2.insert(16, ' Async updates');
const sv1 = Y.encodeStateVector(doc1);
const update2 = Y.encodeStateAsUpdate(doc2, sv1);
Y.applyUpdate(doc1, update2);

console.log("SECOND UPDATE:")
console.log("text1", text1.toJSON())
console.log("text2", text2.toJSON())
console.log("---")
