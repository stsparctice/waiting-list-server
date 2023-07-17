const { available, isActive } = require('../../modules/checkScedule')

describe('available', () => {

    it('should return true when it is possible to insert current to arrOfObjHours', () => {
        let arrOfObjHours = [{ start: "08:00", end: "10:30" }, { start: "13:45", end: "18:00" }]
        let current = { start: "11:00", end: "13:00" }
        let answer = available(arrOfObjHours, current)
        expect(answer).toBeDefined();
        expect(answer).toBeTruthy()
    })
    it('should return false when it is impossible to insert  current to arrOfObjHours', () => {
        let arrOfObjHours = [{ start: "08:00", end: "10:30" }, { start: "13:45", end: "18:00" }]
        let current = { start: "09:00", end: "13:00" }
        let answer = available(arrOfObjHours, current)
        expect(answer).toBeDefined();
        expect(answer).toBeFalsy()
    })
    it('should throw an error when arguments are dosent have an attribute start/end', () => {
        let arrOfObjHours = [{ startHour: "08:00", end: "10:30" }, { start: "13:45", end: "18:00" }]
        let current = { start: "09:00", end: "13:00" }
        try {
            available(arrOfObjHours, current)
        }
        catch(error) {
            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('one of arguments dosent have an attribute start/end');
        }
        
    })

})


describe('isActive', () => {

    it('should return true when current is in the hours of arrOfObjHours', () => {
        let arrOfObjHours = [{ start: "08:00", end: "10:30" }, { start: "13:45", end: "18:00" }]
        let current = { start: "09:00", end: "10:00" }
        let answer = isActive(arrOfObjHours, current)
        expect(answer).toBeDefined();
        expect(answer).toBeTruthy()
    })
    it('should return false when current is not in the hours of arrOfObjHours', () => {
        let arrOfObjHours = [{ start: "08:00", end: "10:30" }, { start: "13:45", end: "18:00" }]
        let current = { start: "11:30", end: "13:00" }
        let answer = isActive(arrOfObjHours, current)
        expect(answer).toBeDefined();
        expect(answer).toBeFalsy()
    })
    it('should throw an error when arguments are dosent have an attribute start/end', () => {
        let arrOfObjHours = [{ startHour: "08:00", end: "10:30" }, { start: "13:45", end: "18:00" }]
        let current = { start: "09:00", end: "13:00" }
        try {
            isActive(arrOfObjHours, current)
        }
        catch(error) {
            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('one of arguments dosent have an attribute start/end');
        }
        
    })

})