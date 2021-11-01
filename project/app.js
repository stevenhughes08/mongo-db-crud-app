const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);
    await client.connect();

    try {
        const results = await circulationRepo.loadData(data);
        assert.equal(data.length, results.insertedCount);

        // console.log(results.insertedCount, results.ops);

        const getData = await circulationRepo.get();
        assert.equal(data.length, getData.length);

    } catch (error) {
        console.log(error);

    } finally {
        const admin = client.db(dbName).admin();
        // console.log(await admin.serverStatus());
        console.log(await admin.listDatabases());
        client.close();
    }
}

main();