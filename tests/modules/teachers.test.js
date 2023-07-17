jest.mock('../../dal/db/mongo/mongo-operations', () => {
<<<<<<< HEAD
    return {
        findMany: jest.fn((query) => {
            if (!query || Object.keys(query).length == 0)
                return [{ name: "sure", gender: "male" }, { name: "pol", gender: "female" }]
            if (query === undefined || query.name == "sure")
                return [{ name: "sure", gender: "male" }];
            return null;
        }),
        deleteTeacher:jest.fn(()=>{
            return 'deleteTeacher'

        }),
        insertOne: jest.fn((obj) => {
            obj.insertedId = 10;
            return obj.insertedId;
        }),
=======


    return {

>>>>>>> shooli
        find: jest.fn((name) => {
            if (name)
                return { name: "ll", phone: "052761250" };
            return null;
        }), deleteOne: jest.fn((name) => {
            if (name)
                return true;
            return false;
        })
    }
    
})



const { filterFromTeachersWithQuery ,insertTeacher, deleteTeacher, mongo_teachers} = require('../../modules/teachers')

describe('FIND WITH QUERY FROM TEACHERS', () => {

    it('should return object from mongoDB', async () => {
        const result = await filterFromTeachersWithQuery({ name: "sure" })
        expect(result).toStrictEqual({ name: "sure", gender: "male" })
        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Object)
        expect(result.notFound).toBeFalsy()
    })

    it('should return null if name not exist', async () => {
        const result = await filterFromTeachersWithQuery({ name: "user" })
        expect(result).toBe(null)
        expect(result).toBeDefined()
    })


    it('should return null if name is empty', async () => {
        const result = await filterFromTeachersWithQuery({})
        expect(result).toBe(null)
        expect(result).toBeDefined()
    })

    it('should return all the colectin if the query is empty req', async () => {
        const result = await filterFromTeachersWithQuery()
        expect(result).toStrictEqual([{ name: "sure", gender: "male" }, { name: "pol", gender: "female" }])
        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Object)
        expect(result.notFound).toBeFalsy()
    })

    it('should return all the colectin if the query is empty query', async () => {
        const result = await filterFromTeachersWithQuery()
        expect(result).toStrictEqual([{ name: "sure", gender: "male" }, { name: "pol", gender: "female" }])
        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Object)
        expect(result.notFound).toBeFalsy()
    })



})



describe('INSERTTEACHER', () => {
    it('should be true  after insert obj', async () => {
        const res = await insertTeacher({ gender:"female",name : "user",phone: "0589625541",teacher_genders:['women', 'mix'],treatment_level :"medium"});
        expect(res).toBeDefined();
    })

    it('should execute insertOne twice', async () => {
        _ = await insertTeacher({ gender:"female",name : "user",phone: "0589625541",teacher_genders:['women', 'mix'],treatment_level :"medium"});
        const methods = jest.requireMock('../../dal/db/mongo/mongo-operations')
        expect(methods.insertOne).toHaveBeenCalled();
        expect(methods.insertOne).toHaveBeenCalledTimes(2);
    })

    it('should return false for empty data', async () => {
        const response = await insertTeacher()
        expect(response).toBeFalsy()
    })

    it('should return obj.insertedId after insert obj', async () => {
        const response = await insertTeacher({ gender:"female",name : "user",phone: "0589625541",teacher_genders:['women', 'mix'],treatment_level :"medium"})
        expect(response).toBeFalsy()
    })
})

describe('DELETETEACHER', () => {
    it('should be true  after  delete data', async () => {
        mongo_teachers = jest.requireMock('../../dal/db/mongo/mongo-operations');
        const response = await deleteTeacher({ name: "ll" });
        expect(response).toBeTruthy()
    })

    it('should return false for empty data', async () => {
        const response = await deleteTeacher()
        expect(response).toBeFalsy()

    })
    it('should execute find teacher once', async () => {
        _ = await deleteTeacher()
        const methods = jest.requireMock('../../dal/db/mongo/mongo-operations')
        expect(methods.find).toHaveBeenCalled()
    })

})

