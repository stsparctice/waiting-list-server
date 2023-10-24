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
        if (response.status === 201) {
            if (response.data.length > 0) {
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
function sendTeachers(obj) {
    const gender = {
        teacherId: "teacherId",
        genderId: obj.teachersGenders[0].item.id,
        addedDate: new Date(),
        userName: "develop",
        disabled: 0
    }
    const level = {
        teacherId: "teacherId",
        levelId: obj.teachersLevels[0].item.id,
        addedDate: new Date(),
        userName: "develop",
        disabled: 0
    }
    const pool = {
        teacherId: "teacherId",
        poolId: obj.teachersPools[0].item.id,
        addedDate: new Date(),
        userName: "develop",
        disabled: 0
    }

    obj.teachersGenders = gender
    obj.teachersLevels = level
    obj.teachersPools = pool
    return obj
}


async function insertTeacher(obj) {
    try {
        const object = sendTeachers(obj)
        const exist = await existNameInDB(object.teacherName)
        if (exist) {
            throw new Error("the name exists in db")
        }
        else {
            const newTeacher = { ...object, addedDate: new Date(), username: 'develop', disabled: 0 }
            const ans = await postData(wlServer, '/create/createTran', { entity: 'teachers', values: newTeacher })
            console.log({ ans }, 'ppppppppppppppppppppppppp');
            return ans.data;
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
    const response = await postData(wlServer, '/read/readMany/teachers', { condition: { id: obj.id, disabled: 0 } })
    console.log({ status: response.status, data: response.data })
    if (response.status === 201) {
        if (obj.teacherName !== response.data[0].teacherName) {
            const exist = await existNameInDB(obj.teacherName)
            if (exist) {
                throw new Error('the name does ')
            }
        }
        const ans = await postData(wlServer, '/update/updateOne', { entity: 'teachers', set: obj, condition: { id: obj.id } })
        return ans
    }
    else {
        throw new Error('teacher does not exist')
    }
}

// // insert To SqlDelete Teacher //
// async function addDisabledTeacher(obj) {
//     try {
//         const ans = await postData(wlServer, '/create_db/createOne', { table_name: 'teachers', values: `'${obj.name}','${obj.phone}','${obj.address.city}'` })
//         return ans
//     }
//     catch (error) {
//         throw error
//     }
// }


// read //
async function findOneTeacher(obj) {
    try {
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { TeacherName: obj.TeacherName, disabled: 0 } })
        if (ans.data[0])
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
module.exports = { findTeacherByPoolAndGender, insertTeacher, insertPoolToTeacher, deleteTeacher, updateTeacher, findOneTeacher, findAllTeachers, findTeacherByCondition, findAllDisabledTeachers }
