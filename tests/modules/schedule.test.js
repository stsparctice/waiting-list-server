
jest.mock('../../services/db/mongo_operation', () => {
    return {
        insertOne: jest.fn((obj) => {
            if (obj) {
                return "123456"
            }
            return undefined
        }),
        findItem: jest.fn((obj) => {
            if (obj == null) {
                return false
            }
            return { 'name': 'Etti' }
        }),
        findItems: jest.fn((obj) => {
            if (obj) {
                return [{ 'name': 'Etti' }, { 'name': 'Etti' }]
            }
            return false
        }),
        updateMany: jest.fn((obj) => {
            if (obj) {
                return "successUpdate"
            }
            return undefined;
        }),
        updateOne: jest.fn((obj) => {
            if (obj) {
                return "successUpdate"
            }
            return undefined;
        })
    }

})

const { addHour, deleteHour, updateHour, deleteActiveHour, getAll, get, getHour } = require('../../modules/schedule')

describe('addHour', () => {
    it('should return successUpdate if it inserted', async () => {
        let response = await addHour({ "poolName": "Ashdod", "day": 'sunday', "startActiveHour": "09:00", "endActiveHour": "09:00" }, "activeHours")
        console.log(response);
        expect(response).toBeDefined()
        expect(response).toBe("successUpdate")
    })
    it('should return successUpdate if it inserted', async () => {
        let response = await addHour({ "poolName": "Ashdod", "day": 'sunday', "startHour": "09:00", "endHour": "09:00", "gender": '1' }, "hours")
        console.log(response);
        expect(response).toBeDefined()
        expect(response).toBe("successUpdate")
    })
    it('should return error if it error', async () => {
        try {
            let response = await addHour({ "poolName": "Ashdod", "day": 'sunday', "startHour": "09:00", "endHour": "09:00", "gender": '1' }, "hours")
        }
        catch (error) {
            console.log(response);
            expect(response).toBeInstanceOf(Error)
        }

    })
})

describe('deleteHour', () => {
    it('should return successUpdate if it deleted', async () => {
        let response = await deleteHour({ "poolName": "Ashdod", day: "sunday" }, "activeHours")
        expect(response).toBeDefined()
        expect(response).toBe("successUpdate")
    })
    it('should return successUpdate if it deleted', async () => {
        let response = await deleteHour({ "poolName": "Ashdod", day: "sunday" }, "hours")
        expect(response).toBeDefined()
        expect(response).toBe("successUpdate")
    })
})

describe('updateHour', () => {
    it('should return successUpdate if it update', async () => {
        let response = await updateHour({ 'poolName': "Ashdod", 'day': "sunday", 'new': { 'startActiveHour': "09:00", 'endActiveHour': "09:00" }, 'old': { 'startActiveHour': "09:00" } }, 'activeHours')
        expect(response).toBeDefined()
        expect(response).toBe("successUpdate")
    })
    it('should return successUpdate if it update', async () => {
        let response = await updateHour({ 'poolName': "Ashdod", 'day': "sunday", 'startHour': "09:00", 'new': { 'startHour': "09:00", 'endHour': "09:00" }, 'old': { 'startHour': "09:00" } }, 'hours')
        expect(response).toBeDefined()
        expect(response).toBe("successUpdate")
    })
})

describe('deleteActiveHour', () => {
    it('should return successUpdate if it deleted', async () => {
        let response = await deleteActiveHour({ "poolName": "Ashdod", day: "sunday" })
        expect(response).toBeDefined()
        expect(response).toBe("successUpdate")

    })
})

describe('getAll', () => {
    it('should return successUpdate if it deleted', async () => {
        let response = await getAll({ "poolName": "Ashdod" }, { "schedule.day": 1, "_id": 0 })
        expect(response).toBeDefined()
        expect(response).toStrictEqual([{ 'name': 'Etti' }, { 'name': 'Etti' }])

    })
})

describe('get', () => {
    it('should return successUpdate if it deleted', async () => {
        let response = await get({ "poolName": "Ashdod" }, { "schedule.day": 1, "_id": 0 })
        expect(response).toBeDefined()
        expect(response).toStrictEqual({ 'name': 'Etti' })

    })
})

describe('getHour', () => {
    it('should return object if it ok', async () => {
        let response = await getHour({ 'poolName': 'ashdod', 'schedule.day': 'sunday', 'schedule.day.startActiveHour': "10:00" }, 'activeHours')
        expect(response).toBeDefined()
        expect(response).toStrictEqual({ 'name': 'Etti' })

    })
    it('should return successUpdate if it deleted', async () => {
        let response = await getHour({ 'poolName': 'ashdod', 'schedule.day': 'sunday', 'schedule.day.starteHour': "10:00" }, 'hours')
        expect(response).toBeDefined()
        expect(response).toStrictEqual({ 'name': 'Etti' })

    })
})




