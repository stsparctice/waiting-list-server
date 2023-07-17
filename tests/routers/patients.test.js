const request = require('supertest')
const { app } = require('../../app');

jest.mock('../../modules/patient', () => {
    return {
        deletePatientById: jest.fn((body) => {
            if (!body || Object.keys(body).length == 0) {
                return false;
            }
            else {
                return true;
            }
        })
    }
})


describe('POST API', () => {
    it('should delete the required id', async () => {
        const response = await request(app).post('/patient/delete').send({ ID: '12343556', status: 'delete' });
        expect(response).toBeTruthy()
        expect(response.statusCode).toBe(200)
    })
    it('should execute deletePatientById twice', async () => {
        const { deletePatientById } = jest.requireMock('../../modules/patient');
        _ = await request(app).post('/patient/delete').send({ ID: '12343556', status: 'delete' });
        expect(deletePatientById).toHaveBeenCalled()
        expect(deletePatientById).toHaveBeenCalledTimes(2)
    })
    it('should return false for empty object', async () => {
        const response = await request(app).post('/patient/delete').send({});
        expect(response.statusCode).toBe(404)
    })
    it('should return a json object', async () => {
        const response = await request(app).post('/patient/delete').send({ ID: '12343556', status: 'delete' });
        expect(response.headers['content-type'])
            .toBe("application/json; charset=utf-8")
    })
})
