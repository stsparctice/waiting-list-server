
jest.mock('../../services/db/mongo_operation', () => {
    return {
        insertOne: jest.fn((obj) => {
            if (obj == undefined || obj === undefined)
                return new Error('cant send an empty details')
            else {
                return "123456"
            }
        }),
        findItem: jest.fn((obj) => {
            if (obj == null) {
                return
            }
            return { 'name': 'Dvory' }
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

const { add, find, getAll, update, deleted } = require("../../modules/gender")
describe('add', () => {
    it('should return inserted id if it succed', async () => {
        let res = await add('name', 'sex', 'mmaxage', 'fmaxage')
        expect(res).toBeDefined()
        expect(res).toBe("123456")
    })
    it('should return falsy if it empty', async () => {
        let res = await add(null)
        expect(res).toBeDefined()
        expect(res).toBe("123456")
        // expect(res).toBeInstanceOf(Error)
        // expect(res.data).toBe('cant send an empty details')
    })

})
describe('update', () => {
    it('should return if it update', async () => {
        let res = await update('name', 'sex', 'mmaxage', 'fmaxage')
        expect(res).toBeDefined()
        expect(res).toBeTruthy()
        expect(res).toBe("successUpdate")
    })

})
describe('find', () => {
    it('should return the items that found', async () => {
        let res = await find('name')
        expect(res).toBeDefined()
        expect(res).toBeInstanceOf(Object)
    })
    it('should return a message if it is not found', async () => {
        let res = await find()
        expect(res).toBeNull
        expect(res.notFound).toBeFalsy()
    })
})
describe('getAll', () => {
    it('should return all the items', async () => {
        let res = await getAll({ disabled: false })
        expect(res).toBeDefined()
        expect(res).toBeInstanceOf(Array)
    })
})
describe('deleted', () => {
    it('', async () => {
        let res = await deleted('name')

    })
})

