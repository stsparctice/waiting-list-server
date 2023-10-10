const express = require('express');
const app = express();
const { deleteTeacherschedule } = require('./teacher_schedule')
const { getData, postData } = require('../services/axios');
const { wlServer } = require('../services/servers')

// insert  //
async function insertTeacher(obj) {
    try {
        const name = await postData(wlServer, '/read/readMany/teachers', { condition: { teacherName: obj.teacherName, disabled: 0 } })
        if (name.data[0]) {
            throw new Error("the name does exist")
        }
        else {
            const ans = await postData(wlServer, '/create/createOne', { entity: 'teachers', values: [{ ...obj, AddedDate: new Date, username: 'develop', disabled: 0 }] })
            return ans;
        }
    }
    catch (error) {
        throw error
    }
}

async function insertPoolToTeacher(obj) {
    try {
        const ans = await postData(wlServer, '/create/createOne', { entity: 'teachersPoolGenders' ,values:[{ ...obj, AddedDate: new Date, username: 'develop', disabled: 0 }]})
        return ans
    }
    catch (error) {
        throw error
    }
}

// delete //
async function deleteTeacher(obj) {
    try {
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { TeacherName: obj.TeacherName, disabled: 0 } })
        if (ans.data[0]) {
            let del = await postData(wlServer, '/delete/deleteOne', { entity: 'teachers', set: { DisabledDate: new Date, DisableUser: obj.DisableUser, DisableReason: obj.DisableReason }, condition: { TeacherName: obj.TeacherName } })
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
    const name = await postData(wlServer, '/read/readMany/teachers', { condition: { TeacherName: obj.TeacherName, disabled: 0 } })
    if (name.data[0]) {
        if (obj.set.name) {
            if (obj.name !== obj.set.name) {
                const teacher = await postData(wlServer, '/read/readMany/teachers', { condition: { TeacherName: obj.TeacherName, disabled: 0 } })
                if (teacher.data[0]) {
                    return "the name is exist";
                }
            }
        }
        const ans = await postData(wlServer, '/update/updateOne', { entity: 'teachers', set: obj.set, condition: { TeacherName: obj.TeacherName } })
        return ans
    }
    else {
        throw new Error('not exist teacher')
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

module.exports = { insertTeacher, insertPoolToTeacher, deleteTeacher, updateTeacher, findOneTeacher, findAllTeachers, findTeacherByCondition, findAllDisabledTeachers }
