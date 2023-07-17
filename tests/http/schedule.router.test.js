
const request = require('supertest')
const { app } = require('../../app')
// const { addHour } = require('../../modules/schedule')

jest.mock('../../modules/schedule', () => {
    return {
        addHour: jest.fn((obj) => {
            if (obj)
                return "12345"
            return false
        }),
        deleteHour: jest.fn((obj) => {
            if (obj)
                return "12345"
            return false
        }),
        updateHour: jest.fn((obj) => {
            if (obj)
                return "12345"
            return false
        }),
        getHour: jest.fn((obj) => {
            if (obj)
                return "12345"
            return false
        }),
        deleteActiveHour: jest.fn((obj) => {
            if (obj)
                return "12345"
            return false
        }),
        get: jest.fn((obj) => {
            if (obj)
                return "12345"
            return false
        }),
        getAll: jest.fn((obj) => {
            if (obj)
                return "12345"
            return false
        }),

    }
})

describe('addActiveHour', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/addActiveHour', { poolName: 'ashdod', day: 'sunday', startActiveHour: '09:00', endActiveHour: '10:00' })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('deleteActiveHour', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/deleteActiveHour', { poolName: 'ashdod', day: 'sunday' })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('addActiveHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/addActiveHourByDay', { poolName: 'ashdod', day: 'sunday', startActiveHour: '09:00', endActiveHour: '10:00' })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})
describe('deleteActiveHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/deleteActiveHourByDay', { poolName: 'ashdod', day: 'sunday', startActiveHour: '09:00', endActiveHour: '10:00' })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('updateActiveHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/updateActiveHourByDay', { poolName: 'ashdod', day: 'sunday', old: {}, new: {} })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('getActiveHour', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).get('/schedule/getActiveHour', { poolName: 'ashdod', day: 'sunday'})
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('getAllActiveHoursByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).get('/schedule/getAllActiveHoursByDay?poolName=ashdod&day=sunday', )
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('getAllHoursByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).get('/schedule/getAllHoursByDay?poolName=ashdod&day=sunday')
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('getAllActiveHours', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).get('/schedule/getAllActiveHours/ashdod')
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('addHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/addHourByDay', { poolName: 'ashdod', day: 'sunday', old: {}, new: {} })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('addHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/addHourByDay', { poolName: 'ashdod', day: 'sunday', old: {}, new: {} })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})

describe('addHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/addHourByDay', { poolName: 'ashdod', day: 'sunday', old: {}, new: {} })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})
// describe('getHour', () => {
//     it('should return the inserted id', async () => {
//         let response = await request(app).post('/schedule/getHour', { poolName: 'ashdod', day: 'sunday', old: {}, new: {} })
//         expect(response).toBeDefined()
//         expect(response.text).toBe("12345")
//         expect(response.statusCode).toBe(200)
//     })
// })
describe('deleteHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/deleteHourByDay', { poolName: 'ashdod', day: 'sunday', old: {}, new: {} })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
})
describe('updateHourByDay', () => {
    it('should return the inserted id', async () => {
        let response = await request(app).post('/schedule/updateHourByDay', { poolName: 'ashdod', day: 'sunday', old: {}, new: {} })
        expect(response).toBeDefined()
        expect(response.text).toBe("12345")
        expect(response.statusCode).toBe(200)
    })
}) 

