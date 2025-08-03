const { MongoClient } = require("mongodb");

const url = 'mongodb+srv://NamasteNode:PqVprWrF2xBV2iaH@namastenode.txanrey.mongodb.net/';
const client = new MongoClient(url);

const dbName = 'HelloWorld';

async function main() {
 
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('user');

  // the following code examples can be pasted here...

  return 'done.';
}
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

