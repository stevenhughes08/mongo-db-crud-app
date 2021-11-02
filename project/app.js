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

        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
        assert.deepEqual(filterData[0], getData[4]);

        const limitData = await circulationRepo.get({}, 3);
        assert.equal(limitData.length, 3);

        const id = getData[4]._id.toString();
        const byId = await circulationRepo.getById(getData[4].id);
        assert.deepEqual(byId, getData[4]);


        const newItem = {
            "Newspaper": "Louisville Courior Journal",
            "Daily Circulation, 2004": 827352,
            "Daily Circulation, 2013": 652152,
            "Change in Daily Circulation, 2004-2013": -43,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 11,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 3,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 13
        }

        const addedItem = await circulationRepo.add(newItem);
        assert(addedItem._id);
        const addedItemQuery = await circulationRepo.getById(addedItem._id);
        assert.deepEqual(addedItemQuery, newItem);




    } catch (error) {
        console.log(error);

    } finally {
        const admin = client.db(dbName).admin();
        // console.log(await admin.serverStatus());

        await client.db(dbName).dropDatabase();
        console.log(await admin.listDatabases());

        client.close();
    }
}

main();