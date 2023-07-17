jest.mock('../../dal/db/mongodb/mongo-operations',()=>{
    return {
        findWithRegex:jest.fn((fn,fv)=>{
            return [{name:"ruti"}]
        }),
        updateOne:jest.fn((obj1,obj2)=>{
            return true;
        })

    }
})

const {findPatientesByFeature,Basicupdate} = require('../../modules/patient.js');


describe('findPatientesByFeature',()=>{
    it('should return defined response', async () => {
        const response = await findPatientesByFeature( "try");

        expect(response).toBeDefined();
    })

    it('should execute findWithRegex twice', async () => {
        _ = await findPatientesByFeature( "try");
        const methods = jest.requireMock('../../dal/db/mongodb/mongo-operations');
        expect(methods.findWithRegex).toHaveBeenCalled();
        expect(methods.findWithRegex).toHaveBeenCalledTimes(2);
    })
})


describe('BASICUPDATE', () => {
    it('should return defined response', async () => {
        const response = await Basicupdate({name:"ruti"},{name:"esti"});
        expect(response).toBeDefined();
    })

    it('should execute updateOne twice', async () => {
        _ = await Basicupdate({name:"ruti"},{name:"esti"});
        const methods = jest.requireMock('../../dal/db/mongodb/mongo-operations');
        expect(methods.updateOne).toHaveBeenCalled();
        expect(methods.updateOne).toHaveBeenCalledTimes(2);
    })
})