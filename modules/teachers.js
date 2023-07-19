const express = require('express');
const app = express();
require('dotenv').config()
const { deleteTeacherSchedule } = require('./teacher_schedule')
const { dbServer, getData, postData } = require('../services/axios');
const { MONGO_TEACHERS_COLLECTION } = process.env;

// insert  //
async function insertTeacher(obj) {
    try {
        console.log("try");
        console.log({ obj });
        console.log("entity:", `tbl_${obj.entity}`, "name:", obj.values.TeacherName);
        const name = await postData(dbServer, '/read_db/readMany', { entity: `tbl_${obj.entity}`, condition: obj.values.TeacherName })
        console.log(name);
        if (name.data[0]) {
            return "the name is exist"
        }
        else {
            const ans = await postData(dbServer, '/create_db/createOne', { ...obj })
            return ans;
        }
    }
    catch (error) {
        console.log("error");
        throw error
    }
}

// delete //
async function deleteTeacher(TeacherName) {
    const ans = await postData(dbServer, '/read_db/read', { table_name: MONGO_TEACHERS_COLLECTION, filter: { ...TeacherName } })
    try {
        if (ans.data[0]) {
            await postData(dbServer, '/delete_db/deleteOne', { table_name: MONGO_TEACHERS_COLLECTION, filter: { ...TeacherName } })
            deleteTeacherSchedule(ans.data[0]._id.toString())
            addDisabledTeacher({ name: ans.data[0].name, phone: ans.data[0].phone, address: ans.data[0].address, annotation: ans.data[0].annotation, email: ans.data[0].email });
        }
        return true;
    }
    catch (error) {
        throw error;
    }
}

// read //
async function findTeacher(obj) {
    try {
        const ans = await postData(dbServer, '/read_db/read', { table_name: MONGO_TEACHERS_COLLECTION, filter: { ...obj } })
        if (ans.data[0])
            return ans;
        return 'the teacher does not exist'
    }
    catch (error) {
        throw error
    }
}

//update //
async function updateTeacher(name, update) {
    let ans = await postData(dbServer, '/read_db/read', { table_name: MONGO_TEACHERS_COLLECTION, filter: { ...name } })
    if (ans.data[0]) {
        if (name.name !== update.name) {
            const teacher = await postData(dbServer, '/read_db/read', { table_name: MONGO_TEACHERS_COLLECTION, filter: { name: update.name } })
            if (teacher.data[0]) {
                return "the name is exist";
            }
        }
        ans = await postData(dbServer, '/update_db/updateOne', { table_name: MONGO_TEACHERS_COLLECTION, filter: { ...name }, update: { "$set": { ...update } } })
    }

    return ans.data
}


// insert To SqlDelete Teacher //
async function addDisabledTeacher(obj) {
    try {
        const ans = await postData(dbServer, '/create_db/createOne', { table_name: 'teachers', values: `'${obj.name}','${obj.phone}','${obj.address.city}'` })
        return ans
    }
    catch (error) {
        throw error
    }
}

// read from Sql //
async function findDisabledTeachers() {
    try {
        const ans = await postData(dbServer, '/read_db/read', { table_name: "teachers", columns: '*', condition: '1=1' })
        if (ans.data[0])
            return ans
        return "data does not exist"
    }
    catch (error) {
        throw error
    }
}

module.exports = { insertTeacher, deleteTeacher, findTeacher, updateTeacher, findDisabledTeachers }
