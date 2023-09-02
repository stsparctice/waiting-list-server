
const { getData, postData } = require('../services/axios')
const { wlServer } = require('../services/servers')
//פונקציה המוסיפה בריכה למערכת
async function add(name, color, address, date) {
    try {
        const newPool = { name, address, color, addedDate: date, userName: 'develop', disabled: 0 }
        let ans = await postData(wlServer, '/create/createOne', { entity: 'swimmingPools', values: newPool })
        newPool.id = ans.Id
        return newPool
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}
//פונקציה המחזירה נתוני בריכה עפי פילטר
async function find(filter = {}, project = {}) {
    try {
        let ans = await postData(wlServer, '/read/readMany/swimmingPools', { condition: filter })
        return ans.data
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}
//פונקציה המעדכנת נתוני בריכה עפי שם הבריכה שמקבלת
async function update(data) {
    try {
        let ans = await postData(wlServer, '/update/updateOne/',
            {
                entity: 'swimmingPools',
                condition: { id: data.id },
                set: data
            })
        console.log(ans)
        return ans
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}
//פונקציה המוסיפה נתון 'מחוק' לבריכה עפי שם הבריכה שמקבלת
async function deleted(name) {
    try {
        let ans = await postData(wlServer, '/crud_db/update', {
            entity: 'swimmingPools', filter: { poolName: name },
            update: { $set: { disabled: true } }
        })
        return ans.data
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}



module.exports = { add, update, find, deleted }
