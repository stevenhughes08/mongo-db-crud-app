const MongoClient = require('mongodb').MongoClient;

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);
    await client.connect();

    const results = await circulationRepo.loadData(data);
    console.log(results.insertedCount, results.ops);
    const admin = client.db(dbName).admin();
    console.log(await admin.listDatabases());
    // closes node after each session this way you don't have to use CTRL+C
    // client.close();
}

main();