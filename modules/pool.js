require('dotenv').config()
const { MONGO_POOL_COLLECTION } = process.env
const { dbServer, getData, postData } = require('../services/axios')
//פונקציה המוסיפה בריכה למערכת
async function add(obj, date) {
    try {
        const name = await postData(dbServer, '/read_db/readOne/SwimmingPools', { condition: { poolName: obj.poolName } })
        if (name.data[0]) {
            return "the name is already exist"
        }
        let ans = await postData(dbServer, '/create_db/createOne/SwimmingPools', {  values:{poolName: obj.poolName, poolColor: obj.poolColor, poolAddress: obj.poolAddress, schedule: [], status: 'add', addedDate: date} })
        return ans.data
    }
    catch (error) {
        throw error
    }
}
//פונקציה המחזירה נתוני בריכה עפי פילטר
async function find(filter = {}, project = {}) {
    try {
        let ans = await postData(dbServer, '/read_db/readOne/SwimmingPools', {  condition: filter, project: project.project })
        if (ans.data.length < 1)
            return "the details didnt found"
        return ans.data
    }
    catch (error) {
        throw error
    }
}
//פונקציה המעדכנת נתוני בריכה עפי שם הבריכה שמקבלת
async function update(obj) {
    try {
        const oldname = await postData(dbServer, '/read_db/readOne/SwimmingPools', { condition: { poolName: obj.oldPoolName } })
        if (oldname.data[0]) {
            let newname
            if (obj.poolName != obj.oldPoolName) {
                newname = await postData(dbServer, '/read_db/readOne/SwimmingPools', { condition: { poolName: obj.poolName } })
                if (newname.data[0]) {
                    return "the new name is already exist"
                }
            }
            let ans = await postData(dbServer, '/update_db/updateOne',
                {   entity:MONGO_POOL_COLLECTION,
                    condition: { poolName: obj.oldPoolName },
                    set: { $set: { poolName: obj.name, poolColor: obj.color, poolAddress: obj.address, status: 'add' } }
                })
            return ans.data
        }
        return "the old name dosnt exist"
    }
    catch (error) {
        throw error
    }
}
//פונקציה המוסיפה נתון 'מחוק' לבריכה עפי שם הבריכה שמקבלת
async function deleted(obj) {
    try {
        let ans = await postData(dbServer, '/read_db/readOne/SwimmingPools', {  condition: { poolName: obj.poolName } })
        if (ans.data[0]) {
            ans = await postData(dbServer, '/update_db/updateOne', {
                entity:MONGO_POOL_COLLECTION,
                condition: { poolName: obj.poolName },
                update: { $set: { disabled: true } }
            })
            return ans.data
        }
        return 'the name is not exist'
    }
        catch (error) {
            throw error
        }
    }



    module.exports = { add, update, find, deleted }
