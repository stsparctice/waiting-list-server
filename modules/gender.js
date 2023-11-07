
const { getData, postData } = require('../services/axios')
const { wlServer } = require('../services/servers')

//פונקציה המוסיפה שם קבוצה למערכת
async function add(data) {
    try {
        const newGender = { ...data, addedDate: new Date().toISOString(), userName: 'develop', disabled: 0 }
        let ans = await postData(wlServer, '/create/createOne', { entity: 'genders', values: newGender })
        newGender.id = ans.data[0].Id
        return newGender
    }
    catch (error) {
        throw error
    }
}

//פונקציה המחזירה נתוני קבוצה עפי שם הקבוצה שמקבלת
async function find(condition) {

    try {
        let ans = await postData(wlServer, '/read/readMany/genders', { condition })   //, { entity: 'GenderCollection', filter: filter, project: project.project }
        return ans.data
    }
    catch (error) {
        throw new Error('dont found matching details')
    }
}

// פונקציה המעדכנת נתוני קבוצה עפי שם הקבוצה שמקבלת
async function update(data) {
    try {
        let ans = await postData(wlServer, '/update/updateOne/',
            {
                entity: 'genders',
                condition: { id: data.id },
                data
            })
        console.log(ans)
        return ans
    }
    catch (error) {
        console.log('error--!!', error);
        throw new Error('dont found matching details')

    }
}

////פונקציה המוסיפה נתון 'מחוק' לקבוצה עפי שם הקבוצה שמקבלת
async function deleted(data) {
    try {

        let ans = await postData(wlServer, '/delete/deleteOne', {
            entity: 'genders', condition: { id: data.id },
            data: { ...data, disableUser: 'develop', disabledDate: new Date().toISOString(), disabled: 1 }
        })

        return ans.data
    }
    catch (error) {
        throw error
    }
}
///
async function findSex(sex) {

    try {
        let ans
        if (sex == 1)
            ans = await getData(wlServer, `/read/readMany/genders?sex1=${sex} `)
        else
            ans = await getData(wlServer, `/read/readMany/genders?sex2=${sex} `)
        return ans.data
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    add,
    find,
    update,
    deleted,
    findSex
}
