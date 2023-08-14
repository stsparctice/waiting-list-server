require('dotenv').config()
const { MONGO_POOL_COLLECTION } = process.env
const { dbServer, getData, postData } = require('../services/axios')
//פונקציה המוסיפה בריכה למערכת
async function add(obj) {
    try {
        const name = await postData(dbServer, '/read_db/readOne/SwimmingPools', { condition: { Name: `'${obj.Name}'` } })
        if (name.data[0]) {
            throw new Error("the name is exist")
        }
        else {
            let ans = await postData(dbServer, '/create_db/createOne', { entity: 'SwimmingPools', values: [{ Name: obj.Name, Color: obj.Color, Address: obj.Address }] })
            return ans
            // , schedule: [], status: 'add', AddedDate: new Date 
        }
    }
    catch (error) {
        throw error
    }
}
//פונקציה המחזירה נתוני בריכה עפי פילטר
async function find(obj) {
    console.log(obj, 'find');
  
    console.log(obj);
    try {
    
        let ans = await postData(dbServer, '/read_db/readOne/SwimmingPools', {condition:obj})
        if (ans.data.length < 1)
            throw new Error("the details didnt found")
        else 
        { 
            console.log('else');
            return ans
        }
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
                {
                    entity: MONGO_POOL_COLLECTION,
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
        let ans = await postData(dbServer, '/read_db/readOne/SwimmingPools', { condition: { poolName: obj.poolName } })
        if (ans.data[0]) {
            ans = await postData(dbServer, '/update_db/updateOne', {
                entity: MONGO_POOL_COLLECTION,
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
