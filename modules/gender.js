require('dotenv').config()
const { dbServer, getData, postData } = require('../services/axios')

//פונקציה המוסיפה שם קבוצה למערכת
async function add(obj,project={}) {
    try {
        let ans = await postData(dbServer, '/read_db/readOne/GenderCollection', {  condition: { name: obj.name } })
        if (ans.data[0]) {
          return 'the gender name is already exist'
        }  
         ans = await postData(dbServer, '/create_db/createOne', { project:project,entity: 'GenderCollection',values:{ name: obj.name, sex: obj.sex, maleMaxAge: obj.maleMaxAge, femaleMaxAge: obj.femaleMaxAge, genderColor: obj.genderColor, status: obj.status} })
        return ans.data
    }
    catch (error) {
        throw error
    }
}

//פונקציה המחזירה נתוני קבוצה עפי שם הקבוצה שמקבלת
async function find(obj , project = {}) {

    try {
        let ans = await postData(dbServer, '/read_db/readOne/GenderCollection', {  condition: {name:obj.name}, project: project.project })
        if(!ans.data[0])
            return 'the gender name didnt found'
        return ans.data
    }
    catch (error) {
        throw new Error('dont found matching details')
    }
}

// פונקציה המעדכנת נתוני קבוצה עפי שם הקבוצה שמקבלת
async function update(obj,disabled=false) {
    try {
        let ans = await postData(dbServer, '/crud_db/update',
            {
                entity: 'GenderCollection', filter: { name: oldname },
                update: { $set: { name: obj.name, sex: obj,sex, mmmaxAge: obj.maleMaxAge, fmaxAge: obj.femaleMaxAge, genderColor: obj.genderColor, disabled: disabled } }
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
        let ans = await postData(dbServer, '/crud_db/update', {
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
