const express = require('express');
const app = express();
require('dotenv').config()
const { deleteTeacherSchedule } = require('./teacher_schedule')
const { dbServer, postData } = require('../services/axios');
const { MONGO_TEACHERS_COLLECTION } = process.env;


// insert  //
async function insertTeacher(obj) {
    const name = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERS_COLLECTION, filter: { name: obj.name } })
    if (name.data[0])
        return "the name is exist"
    const ans = await postData(dbServer, '/crud_db/insert', { entity: MONGO_TEACHERS_COLLECTION, ...obj })
    return ans.data;
}

// delete //
async function deleteTeacher(TeacherName) {
    const ans = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERS_COLLECTION, filter: { ...TeacherName } })
    try {
        if (ans.data[0]) {
            await postData(dbServer, '/crud_db/delete', { entity: MONGO_TEACHERS_COLLECTION, filter: { ...TeacherName } })
            deleteTeacherSchedule(ans.data[0]._id.toString())
            addDisabledTeacher({ name: ans.data[0].name, phone: ans.data[0].phone, address: ans.data[0].address,annotation:ans.data[0].annotation,email:ans.data[0].email });
        }
        return true;
    }
    catch {
        return false;
    }
}

// read //
async function findTeacher(obj) {
    const ans = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERS_COLLECTION, filter: { ...obj } })
    return ans.data;
}

//update //
async function updateTeacher(name, update) {
    let ans = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERS_COLLECTION, filter: { ...name } })
    if (ans.data[0]) {
        if (name.name !== update.name) {
            const teacher = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERS_COLLECTION, filter: { name: update.name } })
            if (teacher.data[0]) {
                return "the name is exist";
            }
        }
        ans = await postData(dbServer, '/crud_db/update', { entity: MONGO_TEACHERS_COLLECTION, filter: { ...name }, update: { "$set": { ...update } } })
    }

    return ans.data
}


// insert To SqlDelete Teacher //
async function addDisabledTeacher(obj) {
    await postData(dbServer, '/crud_db/insert', { entity: 'teachers', values: `'${obj.name}','${obj.phone}','${obj.address.city}','${obj.address.street}','${obj.address.zip}','${obj.email}','${obj.annotation}'` })
}

// read from Sql //
async function findDisabledTeachers() {
    const ans = await postData(dbServer, '/crud_db/read', { entity: "teachers", columns: '*', condition: '1=1' })
    if (ans.data)
        return ans.data
    return "there is no data"



}






module.exports = { insertTeacher, deleteTeacher, findTeacher, updateTeacher, findDisabledTeachers }












