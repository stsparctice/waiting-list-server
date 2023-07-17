const request = require ('supertest');
const {app} = require ('../../app');

jest.mock('../../modules/patient',()=>{
    return{
        findPatientesByFeature:jest.fn((fname,fvalue)=>{
            return [{name:"ruti"}]
        }),
        Basicupdate:jest.fn((obj1,obj2)=>{
            return true;
        })
    }
})

describe('GET PATIENTS BY VALUE', () => {
    it('get("/patient/findPatientesByFeature/name/ruti") returns an answer', async () => {
        const response = await request(app).get('/patient/findPatientesByFeature/name/ruti');
        expect(response.statusCode).toBe(200);
        expect(response.notFound).toBeFalsy();
    })

    it('should get(/patient/findPatientesByFeature/name/ruti) returns a json answer', async () => {
        const response = await request(app).get('/patient/findPatientesByFeature/name/ruti');
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    })

    it('should execute findPatientesByFeature 3 times', async () => {
        _ = await request(app).get('/patient/findPatientesByFeature/name/ruti');
        const methods = jest.requireMock('../../modules/patient');
        expect(methods.findPatientesByFeature).toHaveBeenCalled();
        expect(methods.findPatientesByFeature).toHaveBeenCalledTimes(3);
    })
})



describe('SET UPDATES',()=>{
    it('post("/patient/Basicupdate") is found',async()=>{
        const response = await request(app).post('/patient/Basicupdate').send({ name: "ruti"},{ "name": "esti"});
        expect(response.statusCode).toBe(200);
        expect(response.notFound).toBeFalsy();
    })

    it('post ("/patient/Basicupdate") returns a json answer',async()=>{
        const response = await request(app).post('/patient/Basicupdate').send({ name: "ruti"},{ "name": "esti"});
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    })

    it('should execute Basicupdate 3 times', async () => {
        _ =  await request(app).post('/patient/Basicupdate').send({ name: "ruti"},{ "name": "esti"});
        const methods = jest.requireMock('../../modules/patient');

        expect(methods.Basicupdate).toHaveBeenCalled();
        expect(methods.Basicupdate).toHaveBeenCalledTimes(3);
    })
})



