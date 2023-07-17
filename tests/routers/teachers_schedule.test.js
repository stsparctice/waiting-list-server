const request = require('supertest');
const { app } = require('../../app');


jest.mock('../../modules/teacher_schedule', () =>{
    return{
        filterByFindFromTeachersScheduleWithQuery: jest.fn((query) =>{
            return {name:"sure", gender:"female"}
        }),
        filterByFindFromTeachersScheduleWithName: jest.fn((query)=>{
            return {teacher:"5432fa56ry", week:{day:"sunday", start:"13:00", end:"20:00", pool:"Ashdod"}}
        })
    }
})

describe('GET ALL SCHEDULES THAT CONCORDANT TO THE QUERY', () => {
    it('should execute 1 times', async () => {
        _ = await request(app).get('/schedule/filterFromScheduleWithQuery?teacher=5432fa56ry');
        const {filterByFindFromTeachersScheduleWithQuery} = jest.requireMock('../../modules/teacher_schedule');
        expect(filterByFindFromTeachersScheduleWithQuery).toHaveBeenCalled();
        expect(filterByFindFromTeachersScheduleWithQuery).toHaveBeenCalledTimes(1);
    })

    it('should get ("/schedule/filterFromScheduleWithQuery?teacher=5432fa56ry") return answer"', async ()=>{
        const result = await request(app).get('/schedule/filterFromScheduleWithQuery?teacher=5432fa56ry');
        expect(result.headers['content-type']).toBe('application/json; charset=utf-8')

    })

    it('get ("/schedule/filterFromScheduleWithQuery?teacher=5432fa56ry return an obj with detalies of this teacher', async () => {
        const response = await request(app).get('/schedule/filterFromScheduleWithQuery?teacher=5432fa56ry')
        expect(response.statusCode).toBe(200)
        expect(response.notFound).toBeFalsy()
    })

   


})
