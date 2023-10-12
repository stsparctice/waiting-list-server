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
            else{
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
            const newTeacher = { ...obj, addedDate: new Date(), username: 'develop', disabled: 0 }
            const ans = await postData(wlServer, '/create/createOne', { entity: 'teachers', values: newTeacher })
            newTeacher.id = ans.data[0].Id
            console.log({ ans })
            console.log(newTeacher)
            return newTeacher;
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
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { id:obj.id} })
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
        if (obj.teacherName!== response.data[0].teacherName){
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

module.exports = { insertTeacher, insertPoolToTeacher, deleteTeacher, updateTeacher, findOneTeacher, findAllTeachers, findTeacherByCondition, findAllDisabledTeachers }
