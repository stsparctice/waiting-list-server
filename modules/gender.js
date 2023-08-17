
const {  getData, postData } = require('../services/axios')
const {wlServer} = require('../services/servers')

//פונקציה המוסיפה שם קבוצה למערכת
async function add(name, genderColor, sex, maleMaxAge, femaleMaxAge, status) {
    try {  
        let ans = await postData(wlServer, '/crud_db/insert', { entity: 'GenderCollection', name: name, sex: sex, maleMaxAge: maleMaxAge, femaleMaxAge: femaleMaxAge, genderColor: genderColor, status: status })
        return ans
    }
    catch (error) {
        throw error
    }
}

//פונקציה המחזירה נתוני קבוצה עפי שם הקבוצה שמקבלת
async function find(filter = {}, project = {}) {

    try {
        let ans = await postData(wlServer, '/read/readMany/Genders')   //, { entity: 'GenderCollection', filter: filter, project: project.project }
        return ans.data
    }
    catch (error) {
        throw new Error('dont found matching details')
    }
}

// פונקציה המעדכנת נתוני קבוצה עפי שם הקבוצה שמקבלת
async function update(oldname, name, sex, maleMaxAge, femaleMaxAge, genderColor, disabled = false) {
    try {
        let ans = await postData(wlServer, '/crud_db/update',
            {
                entity: 'GenderCollection', filter: { name: oldname },
                update: { $set: { name: name, sex: sex, mmmaxAge: maleMaxAge, fmaxAge: femaleMaxAge, genderColor: genderColor, disabled: disabled } }
            })
            console.log('ans-------',ans.data);
        return ans
    }
    catch {
        console.log('error--!!', error);
        throw new Error('dont found matching details')

    }
}

////פונקציה המוסיפה נתון 'מחוק' לקבוצה עפי שם הקבוצה שמקבלת
async function deleted(filter) {
    try {
        let ans = await postData(wlServer, '/crud_db/update', {
            entity: 'GenderCollection', filter: { name: filter },
            update: { $set: { disabled: true } }
        })
        return ans.matchedCount
    }
    catch {
        throw new Error('dont found matching details')
    }
}
module.exports = {
    add,
    find,
    update,
    deleted
}
