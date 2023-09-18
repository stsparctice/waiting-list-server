require('dotenv').config()
const { MONGO_TEACHERSCHEDULE_COLLECTION } = process.env;
const { postData } = require('../services/axios');
const { wlServer } = require('../services/servers')




// insert
async function insertTeacherSchedule(obj) {
    console.log("obj: ", obj);
    try {
        obj.name = await findTeacherScheduleByTeacherName(obj.name)
        console.log("obj", obj);
        if (obj.name) {
            const schedule = await postData(wlServer, '/read/readOne/teachers', { condition: { id: obj.name.id } , entitiesFields: [
                {
                    entity: 'teachers', fields: [
                        'id']
                }, {
                    entity:'teachersPoolGenders', fields:[
                        'id', 'teacherId', 'genderId'
                    ]
                }
            ]})
            console.log({schedule});
            if (!schedule.data[0]) {
                const ans = await postData(wlServer, '/create/insert', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, ...obj })
                return ans.data;
            }
        }
        return "the name does not exist"
    }
    catch (error) {
        throw error
    }
}

async function insertPoolDaySchedule(obj) {
    try {
        const ans = await postData(wlServer, '/create/createOne', { entity: 'poolDaySchedule' ,values:[{ ...obj, AddedDate: new Date, username: 'develop', disabled: 0 }]})
        return ans
    }
    catch (error) {
        throw error
    }
}

insertPoolDaySchedule

// delete
async function deleteTeacherSchedule(id) {
    try {
        const ans = await postData(wlServer, '/crud_db/delete', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: id } })
    }
    catch (error) {
        throw error
    }
}

// update
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
        const ans = await postData(wlServer, '/read/readMany/teachers', { condition: { techerName: name, disabled: 0 } })
        console.log("ans", ans.data);
        if (ans.data[0]) {
            return ans.data[0]
        }
        else {
            return false;
        }
    }
    catch (error) {
        throw error
    }
}

module.exports = { deleteTeacherSchedule, insertPoolDaySchedule, updateTeacherSchedule, insertTeacherSchedule, findTeachersSchedule, findTeacherScheduleToSpecificTeacher }
