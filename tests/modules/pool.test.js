
jest.mock('../../services/db/mongo_operation', () => {
    return {
        insertOne: jest.fn((obj) => {
            if (obj) { return "123456" }
            else {
                return undefined
            }
        }),
        findItem: jest.fn((obj) => {
            if (obj) {
                return { 'name': 'Dvory' }

            }
            else {
                return false
            }

        }),
        findItems: jest.fn(() => {
            return [{ 'name': 'Dvory' }, { 'name': 'Dvory' }]
        }),
        updateMany: jest.fn((obj) => {
            return "successUpdate";
        }),
        updateOne: jest.fn((obj) => {
            return "successUpdate";

        })
    }
})


const { add, update, find, getAll,deleted } = require("../../modules/pool")
describe('AddPool', () => {
    it('should return inserted id if it succed', async () => {
        let res = await add("Ashdod", "blue", { "city": "Ashdod", "street": "Horkenus", "number": 5 }, "kkk")
        expect(res).toBeDefined()
        expect(res).toBe("123456")
    })
    it('should return falsy if it empty', async () => {
        let res = await add()
        expect(res).toBeDefined()
        expect(res.massage).toBe(undefined)
    })

})
describe('update', () => {
    it('should return if it update', async () => {
        let res = await update("dvori", "blue", [])
        expect(res).toBeDefined()
        expect(res).toBeTruthy()
        expect(res).toBe("successUpdate")
    })

})
describe('find', () => {
    it('should return the items that found', async () => {
        let res = await find({ "scedule.day": "sunday" })
        expect(res).toBeDefined()
        expect(res).toBeInstanceOf(Object)
    })
    it('should return a message if it is not found', async () => {
        let res = await find()
        expect(res.data).toBe(undefined)
        expect(res).toBeDefined()
    })
})
describe('getAll', () => {
    it('should return all the items', async () => {
        let res = await getAll({ disabled: false })
        expect(res).toBeDefined()
        expect(res).toBeInstanceOf(Array)
    })
})
describe('deleted',()=>{
    it('should return if it deleted',async()=>{
        let res=await deleted({name:'Happy'})
        expect(res).toBeDefined()
        // expect(res.text).toBe('successUpdate')
    })
})


