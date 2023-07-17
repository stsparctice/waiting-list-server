require('dotenv').config()
const { connect, disconnect } = require('../../services/db/mongo_connection')
const MongoDBOperation = require('../../services/db/mongo_operation')
const { MONGO_CONNECTION } = process.env
let testdb;
describe('MONGO OPERATIONS', () => {
    beforeAll(async () => {
        testdb = MongoDBOperation;
        testdb.collectionName = "pool";
        testdb.dbName = "tests";



        await connect(MONGO_CONNECTION)


    })
    afterAll(async () => {
        await disconnect()
    })
    describe('insertOne', () => {
        beforeAll(async () => {
            console.log('connected');
            testdb = MongoDBOperation;
            testdb.collectionName = "pool";
            testdb.dbName = "tests";



            await connect(MONGO_CONNECTION)


        })
        it('should insert one document', async () => {
            const obj = { key: 123, name: "fff" }
            const result = await testdb.insertOne(obj)
            expect(result).toBeDefined()
        })
        afterAll(async () => {
            await disconnect()
        })
    })
    describe('insertMany', () => {

        beforeAll(async () => {
            testdb = MongoDBOperation;
            testdb.collectionName = "pool";
            testdb.dbName = "tests";


            await connect(MONGO_CONNECTION)


        })

        it('should insert a few documents', async () => {
            const obj = [{ key: 123, name: "fff" }, { key: 222, name: "abc" }, { key: 456, name: "lll" }]
            const result = await testdb.insertMany(obj)
            expect(result).toBeInstanceOf(Object)
        })
        afterAll(async () => {
            await disconnect()
        })
    })

    describe('findItem', () => {

        beforeAll(async () => {
            testdb = MongoDBOperation;
            testdb.collectionName = "pool";
            testdb.dbName = "tests";



            await connect(MONGO_CONNECTION)


        })

        it('should return if the inserted object is found', async () => {
            const obj = { key: 123 }
            const result = await testdb.findItem(obj)
            expect(result).toBeInstanceOf(Object)
        })
        afterAll(async () => {
            await disconnect()
        })
    })

    describe('findItems', () => {
        beforeAll(async () => {
            testdb = MongoDBOperation;
            testdb.collectionName = "pool";
            testdb.dbName = "tests";


            await connect(MONGO_CONNECTION)


        })
        it('should return an array if its found', async () => {
            const obj = { key: "123" }
            const proj = { value: 1 }
            const result = await testdb.findItems(obj, proj)
            expect(result).toBeInstanceOf(Array)
        })
        afterAll(async () => {
            await disconnect()
        })
    })
    describe('updateOne', () => {

        beforeAll(async () => {
            console.log('connected');
            testdb = MongoDBOperation;
            testdb.collectionName = "pool";
            testdb.dbName = "tests";


            await connect(MONGO_CONNECTION)


        })

        it('should return if it update', async () => {
            const fil = { name: "ggg" }
            const set = { name: "hhh" }
            const arrayFilters={name: "hhh" }
            const result = await testdb.updateOne(fil, set,arrayFilters)
            expect(result).toBeDefined()
        })
        afterAll(async () => {
            await disconnect()
        })
    })

    describe('updateMany', () => {

        beforeAll(async () => {
            testdb = MongoDBOperation;
            testdb.collectionName = "pool";
            testdb.dbName = "tests";


            await connect(MONGO_CONNECTION)


        })
        it('should return if it update', async () => {
            const fil = { name: "ggg" }
            const set = { name: "hhh" }
            const result = await testdb.updateMany(fil, set)
            expect(result).toBeDefined()
        })
        afterAll(async () => {
            await disconnect()
        })
    })


})
