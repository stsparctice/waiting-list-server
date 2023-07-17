require('dotenv').config()

const { dbServer, getData, postData } = require('../services/axios')
//פונקציה המוסיפה בריכה למערכת
async function add(name, color, address,date) {
    try {
        let ans = await postData(dbServer, '/crud_db/insert', { entity: 'SwimmingPool', poolName: name, poolColor: color, poolAddress: address, schedule: [], status: 'add',addedDate:date })
        return ans
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}
//פונקציה המחזירה נתוני בריכה עפי פילטר
async function find(filter = {}, project = {}) {
    try {
        let ans = await postData(dbServer, '/crud_db/read', { entity: 'SwimmingPool', filter: filter, project: project })
        return ans.data
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}
//פונקציה המעדכנת נתוני בריכה עפי שם הבריכה שמקבלת
async function update(oldPoolName, name, color, address) {
    try {
        let ans = await postData(dbServer, '/crud_db/update',
            {
                entity: 'SwimmingPool', filter: { poolName: oldPoolName },
                update: { $set: { poolName: name, poolColor: color, poolAddress: address, status: 'add' } }
            })
        return ans.matchedCount
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}
//פונקציה המוסיפה נתון 'מחוק' לבריכה עפי שם הבריכה שמקבלת
async function deleted(name) {
    try {
        let ans = await postData(dbServer, '/crud_db/update', {
            entity: 'SwimmingPool', filter: { poolName: name },
            update: { $set: { disabled: true } }
        })
        return ans.data
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}



module.exports = { add, update, find, deleted }
