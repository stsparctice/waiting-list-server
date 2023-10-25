const express = require('express');
const app = express();
require('dotenv').config()
const { deleteTeacherSchedule } = require('./teacher_schedule')
const { dbServer, getData, postData } = require('../services/axios');
const {checkObj}=require('../services/validation')
const teacherType = {
    ID: { name: 'id', type: 'number', required: true },
    TeacherName: { name: 'teacherName', type: 'nvarchar', required: true },
    Phone: { name: 'phone', type: 'nvarchar', required: false },
    Email: { name: 'email', type: 'nvarchar', required: false },
    Address: { name: 'address', type: 'nvarchar', required: false },
    City: { name: 'city', type: 'nvarchar', required: false },
    Gender: { name: 'gender', type: 'number', required: false },
    Annotation: { name: 'annotation ', type: 'nvarchar', required: false },
    AddedDate: { name: 'addedDate', type: 'datetime ', required: true },
    UserName: { name: 'userName', type: 'nvarchar', required: true },
    Disabled: { name: 'disabled', type: 'number', required: false },
    DisabledUser: { name: 'disabledUser', type: 'nvarchar', required: false },
    DisableReason: { name: 'disableReason', type: 'nvarchar', required: false }
}

// insert  //
async function insertTeacher(obj) {
    checkObj(teacherType,obj)
    try {
        const name = await postData(dbServer, '/read/readMany/Teachers', { condition: { TeacherName: `'${obj.TeacherName}'`, Disabled: 0 } })
        if (name.data[0]) {
            throw new Error("the name is exist")
        }
        else {
            const ans = await postData(dbServer, '/create/createOne', { entity: 'Teachers', values: [{ ...obj, AddedDate: new Date, Disabled: 0 }] })
            return ans;
        }
    }
    catch (error) {
        throw error
    }
}

// delete //
async function deleteTeacher(obj) {
    try {
        const ans = await postData(dbServer, '/read/readMany/Teachers', { condition: { TeacherName: `'${obj.TeacherName}'`, Disabled: 0 } })
        if (ans.data[0]) {
            let del = await postData(dbServer, '/delete/deleteOne', { entity: 'Teachers', set: { DisabledDate: new Date, DisableUser: obj.DisableUser, DisableReason: obj.DisableReason }, condition: { TeacherName: `'${obj.TeacherName}'` } })
            return del
            // deleteTeacherSchedule(ans.data[0]._id.toString())
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
    const name = await postData(dbServer, '/read/readMany/Teachers', { condition: { TeacherName: `'${obj.TeacherName}'`, Disabled: 0 } })
    if (name.data[0]) {
        if (obj.set.name) {
            if (obj.name !== obj.set.name) {
                const teacher = await postData(dbServer, '/read/readMany/Teachers', { condition: { TeacherName: `'${obj.TeacherName}'`, Disabled: 0 } })
                if (teacher.data[0]) {
                    return "the name is exist";
                }
            }
        }
        const ans = await postData(dbServer, '/update/updateOne', { entity: 'Teachers', set: obj.set, condition: { TeacherName: `'${obj.TeacherName}'` } })
        return ans
    }
    else {
        throw new Error('not exist teacher')
    }
}

// // insert To SqlDelete Teacher //
// async function addDisabledTeacher(obj) {
//     try {
//         const ans = await postData(dbServer, '/create_db/createOne', { table_name: 'teachers', values: `'${obj.name}','${obj.phone}','${obj.address.city}'` })
//         return ans
//     }
//     catch (error) {
//         throw error
//     }
// }


// read //
async function findOneTeacher(obj) {
    try {
        const ans = await postData(dbServer, '/read/readMany/Teachers', { condition: { TeacherName: `'${obj.TeacherName}'`, Disabled: 0 } })
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
        const ans = await postData(dbServer, '/read/readMany/Teachers', { condition: { ...obj, Disabled: 0 } })
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
        const ans = await postData(dbServer, '/read/readMany/Teachers', { condition: { Disabled: 0 } })
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
        const ans = await postData(dbServer, '/read/readMany/Teachers', { condition: { Disabled: 1 } })
        if (ans.data[0])
            return ans
        return "data does not exist"
    }
    catch (error) {
        throw error
    }
}

module.exports = { insertTeacher, deleteTeacher, updateTeacher, findOneTeacher, findAllTeachers, findTeacherByCondition, findAllDisabledTeachers }
