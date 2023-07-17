const request = require('supertest');
const { app } = require('../../app');


jest.mock('../../modules/teachers', () =>{
    return{
        filterFromTeachersWithQuery: jest.fn((query) =>{
            return {name:"sure", gender:"female"}
        }),
        deleteTeacher: jest.fn((name) => {

            if (name)
                return true;
            return false;
        })
    }
})

describe('GET ALL TEACHERS THAT CONCORDANT TO THE QUERY', () => {
    it('should execute 1 times', async () => {
        _ = await request(app).get('/teachers/filterAccordingToQueryString?name=sure');
        const {filterFromTeachersWithQuery} = jest.requireMock('../../modules/teachers');
        expect(filterFromTeachersWithQuery).toHaveBeenCalled();
        expect(filterFromTeachersWithQuery).toHaveBeenCalledTimes(1)
    })

    it('should get ("/teachers/filterAccordingToQueryString?name=sure") return answer"', async ()=>{
        const result = await request(app).get('/teachers/filterAccordingToQueryString?name=sure');
        expect(result.headers['content-type']).toBe('application/json; charset=utf-8')

    })

    it('get ("/teachers/filterAccordingToQueryString?name=sure return an obj with detalies of this teacher', async () => {
        const response = await request(app).get('/teachers/filterAccordingToQueryString?name=sure')
        expect(response.statusCode).toBe(200)
        expect(response.notFound).toBeFalsy()
    })

   


})
// const request = require('supertest');
// const { app } = require('../../app');

// describe('POST API', () => {
//     it('', async () => {
//         const response = await request(app).post('teachers/insertTeacher');
//         expect().toBe(200);
//     })
// })

describe('DELETE TEACHER', () => {

    it('status should be 200 when delete teacher from db', async () => {
        const response = await request(app).post('/teachers/deleteTeacher', { name: "yser" });
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
    })

    it('should send object ', async () => {
        const response = await request(app).post('/teachers/deleteTeacher', { name: "yser" })
        expect(response.headers['content-type']).toBe("application/json; charset=utf-8")

    })

    it('should execute deleteTeacher once', async () => {
        _ = await request(app).post('/teachers/deleteTeacher', { name: "yser" });
        const { deleteTeacher } = jest.requireMock('../../modules/teachers');
        expect(deleteTeacher).toHaveBeenCalled();
    })

    it('should delete the teacher in db', async () => {
        const response = await request(app).post('/teachers/deleteTeacher', { name: "yser" })
        expect(response).toBeDefined();
    })
})
