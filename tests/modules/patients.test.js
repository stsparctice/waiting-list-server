jest.mock('../../dal/db/mongodb/mongo-operations', () => {
    return {
        findOne: jest.fn((obj) => {
            if (obj.id) {
                console.log('find');
                return true;
            }
            else {
                console.log('did not find');
                return false;
            }
        }),
        deleteOne: jest.fn((obj) => {
            if (!obj || Object.keys(obj).length == 0) {
                console.log('dont del');
                return false;
            }
            else {
                console.log('del');
                return true;
            }
        })
    }
})
jest.mock('../../dal/db/sql/sql-operations', () => {
    return {
        addPatient: jest.fn((obj, status) => {
            if (obj && status) {
                console.log('add');
                return true;
            }
            else {
                console.log('dont add');
                return false;
            }
        })
    }
})
const { deletePatientById } = require('../../modules/patient')

describe('functions ', () => {
    it('should delete and insert to sql the required id', async () => {
        const response = await deletePatientById({ ID: 12343556, status: 'delete' });
        expect(response).toBeTruthy()
    })

    it('should execute find one time and no execute add and delete', async () => {
        const { findOne, deleteOne } = jest.requireMock('../../dal/db/mongodb/mongo-operations');
        const { addPatient } = jest.requireMock('../../dal/db/sql/sql-operations');
        _ = await deletePatientById({});
        expect(findOne).toHaveBeenCalledTimes(2);
        expect(deleteOne).toHaveBeenCalledTimes(1);
        expect(addPatient).toHaveBeenCalledTimes(1);
    })

    it('should return false for empty object', async () => {
        const response = await deletePatientById({});
        expect(response).toBeFalsy();
    })
})