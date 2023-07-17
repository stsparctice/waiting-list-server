require('dotenv').config()
const { MONGO_TEACHERSCHEDULE_COLLECTION, MONGO_TEACHERS_COLLECTION } = process.env;
const { dbServer, postData } = require('../services/axios');


// insert
async function insertTeacherSchedule(obj) {
    obj.name = await findTeacherScheduleByTeacherName(obj.name)
    if (obj.name) {
        const schedule = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: obj.name } })

        if (!schedule.data[0]) {
            const ans = await postData(dbServer, '/crud_db/insert', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, ...obj })
            return ans.data;
        }

    }
    return "the name is not exist"

}

//delete
async function deleteTeacherSchedule(id) {
    await postData(dbServer, '/crud_db/delete', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: id } })

}

//update
async function updateTeacherSchedule(name, update) {
    name = await findTeacherScheduleByTeacherName(name)
    if (name) {
        ans = await postData(dbServer, '/crud_db/update', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: name }, update: { "$set": { ...update } } })
        return ans.data;

    }
    return "the name is not exist"
}


// read 
async function findTeachersSchedule(obj) {
    const ans = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { ...obj } })
    return ans.data;
}

async function findTeacherScheduleToSpecificTeacher(name) {
    name = await findTeacherScheduleByTeacherName(name)
    if (name) {
        ans = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERSCHEDULE_COLLECTION, filter: { name: name } })
        return ans.data;
    }
    return "the name is not exist"


}

async function findTeacherScheduleByTeacherName(name) {
    const id = await postData(dbServer, '/crud_db/read', { entity: MONGO_TEACHERS_COLLECTION, filter: { name: name }, project: { _id: 1 } })
    if (id.data[0]) {
        return id.data[0]._id.toString();
    }
    else {
        return false;
    }

    
}




module.exports = { deleteTeacherSchedule, updateTeacherSchedule, insertTeacherSchedule, findTeachersSchedule, findTeacherScheduleToSpecificTeacher }

