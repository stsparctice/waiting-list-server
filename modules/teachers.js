const express = require('express');
const app = express();
const { deleteTeacherschedule } = require('./teacher_schedule')
const { getData, postData } = require('../services/axios');
const { wlServer } = require('../services/servers')

// insert  //
async function existNameInDB(teacherName) {
    const condition = { teacherName }
    try {
        const response = await postData(wlServer, '/read/exist/teachers', { condition })
        if (response.status === 200) {
            if (response.data === true) {
                return true
            }
            else {
                return false
            }
        }
    }
    catch (error) {
        throw error
    }
}


async function insertTeacher(obj) {
    try {
        const exist = await existNameInDB(obj.teacherName)
        if (exist) {
            throw new Error("the name exists in db")
        }
        else {

            const newTeacher = { ...obj, addedDate: new Date(), userName: 'develop', disabled: 0 }
            const ans = await postData(wlServer, '/create/createTran', { entity: 'teachers', values: newTeacher })
            if (ans.status === 201) {
                const result = { id: ans.data.result, ...newTeacher }
                return result;
            }
        }
    }
    catch (error) {
        throw error
    }
}

async function insertPoolToTeacher(obj) {
    try {
        const ans = await postData(wlServer, '/create/createOne', { entity: 'teachersPoolGenders', values: [{ ...obj, AddedDate: new Date, username: 'develop', disabled: 0 }] })
        return ans
    }
    catch (error) {
        throw error
    }
}

// delete //
async function deleteTeacher(obj) {
    try {
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { id: obj.id } })
        if (ans.data[0]) {
            let del = await postData(wlServer, '/delete/deleteOne', { entity: 'teachers', set: { disabledDate: new Date(), disableUser: 'developer', disableReason: obj.DisableReason }, condition: { id: obj.id } })
            return del
            // deleteteacherschedule(ans.data[0]._id.toString())
            // addDisabledTeacher({ name: ans.data[0].name, phone: ans.data[0].phone, address: ans.data[0].address, annotation: ans.data[0].annotation, email: ans.data[0].email });
        }
        else {
            throw new Error('the name is not exist')
        }
    }
    catch (error) {
        throw error;
    }
}

//update //
async function updateTeacher(obj) {
    const response = await getData(wlServer, '/read/readOne/teachers', { id: obj.id, disabled: 0 })
    if (response.status === 200) {
        const origin = response.data
        if (origin.teacherName !== obj.teacherName) {
            const exist = await existNameInDB(obj.teacherName)
            console.log({ exist })
            if (exist) {
                throw new Error("the name exists in db")
            }
        }
        const ans = await postData(wlServer, '/update/updateOne', { entity: 'teachers', data: obj, condition: { id: obj.id } })
        return ans
    }
    else {
        throw new Error('teacher does not exist')
    }
}


// read //
async function findOneTeacher(query) {
    try {
        const ans = await getData(wlServer, '/read/readOne/teachers', query)
        console.log({ ans })
        if (ans.data)
            return ans;
        return 'the teacher does not exist'
    }
    catch (error) {
        throw error
    }
}

// readByCondition //
async function findTeacherByCondition(obj) {
    try {
        console.log({ obj })
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { ...obj, disabled: 0 } })
        if (ans.data[0])
            return ans;
        return 'the teacher does not exist'
    }
    catch (error) {
        throw error
    }
}

// readAll //
async function findAllTeachers() {
    try {
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { disabled: 0 } })
        if (ans.data[0])
            return ans;
        return 'the teacher does not exist'
    }
    catch (error) {
        throw error
    }
}

// read disabled teachers from sql //
async function findAllDisabledTeachers() {
    try {
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { disabled: 1 } })
        if (ans.data[0])
            return ans
        return "data does not exist"
    }
    catch (error) {
        throw error
    }
}

async function findTeacherByPoolAndGender(obj) {
    try {
        const gender = await postData(wlServer, '/read/readMany/teachersGenders', { condition: { genderId: obj.genderId } })
        const pool = await postData(wlServer, '/read/readMany/teachersPools', { condition: { poolId: obj.poolId } })
        if (gender.data && pool.data) {
            let answer = []
            for (let i = 0; i < gender.data.length; i++) {
                for (let j = 0; j < pool.data.length; j++) {
                    if (gender.data[i].teacherId.id == pool.data[j].teacherId.id)
                        answer.push(pool.data[j].teacherId)
                }
            }
            let ans = []
            if (obj.levelId) {
                ans = findByLevel(answer, obj.levelId)
            }
            console.log(answer, 'answer');
            if (ans.length > 0)
                return ans
            return answer
        }
        return "data does not exist"
    }
    catch (error) {
        throw error
    }
}

async function getTeachersLevels(teacherId) {
    try {
        const response = await postData(wlServer, '/read/readMany/teachersLevels', { condition: { teacherId } })
        if (response.status === 200) {
            const { data } = response
            if (data.length > 0) {
                const levels = data.map(({ teacherId, ...rest }) => rest)
                return levels
            }

        }
    }
    catch (error) {
        throw error
    }
}

async function getTeachersGenders(teacherId) {
    try {
        const response = await postData(wlServer, '/read/readMany/teachersGenders', { condition: { teacherId } })
        if (response.status === 200) {
            const { data } = response
            if (data.length > 0) {
                const levels = data.map(({ teacherId, ...rest }) => rest)
                return levels
            }

        }
    }
    catch (error) {
        throw error
    }
}

async function getTeachersPools(teacherId) {
    try {
        const response = await postData(wlServer, '/read/readMany/teachersPools', { condition: { teacherId } })
        if (response.status === 200) {
            const { data } = response
            if (data.length > 0) {
                const levels = data.map(({ teacherId, ...rest }) => rest)
                return levels
            }

        }
    }
    catch (error) {
        throw error
    }
}

async function findByLevel(teacher, levelId) {
    const level = await postData(wlServer, '/read/readMany/teachersLevels', { condition: { levelId: levelId } })
    if (level.data) {
        let ans = []
        for (let i = 0; i < teacher.length; i++) {
            for (let j = 0; j < level.data.length; j++) {
                if (teacher[i].id == level.data[j].teacherId.id)
                    ans.push(level.data[j].teacherId)
            }
        }
        return ans
    }
    return "data does not exist"
}
async function findGendersAndDaysByTeachers(id) {
    try {
        console.log(id, 'id33333');
        const gender = await postData(wlServer, '/read/readMany/teachersGenders', { condition: { teacherId: id.id } })
        console.log(gender.data, 'gender');
        let ids = gender.data.map(g =>
            g.genderId.id
        )
        console.log(ids, 'ids');
        const days = []
        for (let i = 0; i < ids.length; i++) {
            let day = await postData(wlServer, '/read/readMany/poolDaySchedule', { condition: { genderId: ids[i] } })
            days.push(day.data[0])
        }
        console.log(days.data, 'days');
        if (days)
            return days
        else
            return "not found!"
    }
    catch (error) {
        throw error
    }
}


async function findHouerByGenderAndDay(condition) {
    try {
        console.log(condition, ('genderId, day'));
        const ans = await postData(wlServer, '/read/readMany/poolDaySchedule', { condition })
        console.log(ans, 'ans');
        if (ans.data)
            return ans.data
        else
            return 'not found'
    }
    catch (error) {
        throw error
    }
}


module.exports = { findHouerByGenderAndDay, findGendersAndDaysByTeachers,
     findTeacherByPoolAndGender, insertTeacher, insertPoolToTeacher, deleteTeacher,
      updateTeacher, findOneTeacher, findAllTeachers, findTeacherByCondition,
       findAllDisabledTeachers, getTeachersGenders, getTeachersLevels, getTeachersPools}
