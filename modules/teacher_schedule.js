require('dotenv').config()
const { MONGO_TEACHERSCHEDULE_COLLECTION } = process.env;
const {  postData } = require('../services/axios');
const {wlServer} = require('../services/servers')

// insert
async function insertTeacherSchedule(obj) {
    try {
        obj.name = await findTeacherScheduleByTeacherName(obj.name)
        if (obj.name) {
            const schedule = await postData(wlServer, '/read/readOne/TeacherSchedule', { condition: { Disabled: 0 } })
            if (!schedule.data[0]) {
                const ans = await postData(wlServer, '/create/insert', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, ...obj })
                return ans.data;
            }
        }
        return "the name is not exist"
    }
    catch (error) {
        throw error
    }
}

//delete
async function deleteTeacherSchedule(id) {
    try {
        const ans = await postData(wlServer, '/crud_db/delete', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: id } })
    }
    catch (error) {
        throw error
    }
}

//update
async function updateTeacherSchedule(name, update) {
    try {
        name = await findTeacherScheduleByTeacherName(name)
        if (name) {
            ans = await postData(wlServer, '/crud_db/update', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: name }, update: { "$set": { ...update } } })
            return ans.data;

        }
        return "the name is not exist"
    }
    catch (error) {
        throw error
    }
}


// read 
async function findTeachersSchedule(obj) {
    try {
        const ans = await postData(wlServer, '/crud_db/read', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { ...obj } })
        return ans.data;
    }
    catch (error) {
        throw error
    }
}

async function findTeacherScheduleToSpecificTeacher(name) {
    try {
        name = await findTeacherScheduleByTeacherName(name)
        if (name) {
            ans = await postData(wlServer, '/crud_db/read', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: name } })
            return ans.data;
        }
        return "the name is not exist"
    }
    catch (error) {
        throw error
    }
}

async function findTeacherScheduleByTeacherName(name) {
    try {
        const ans = await postData(wlServer, '/read/readMany/Teachers', { condition: { TecherName: `'${name}'`, Disabled: 0 } })
        if (id.data[0]) {
            return id.data[0]._id.toString();
        }
        else {
            return false;
        }
    }
    catch (error) {
        throw error
    }
}

module.exports = { deleteTeacherSchedule, updateTeacherSchedule, insertTeacherSchedule, findTeachersSchedule, findTeacherScheduleToSpecificTeacher }
