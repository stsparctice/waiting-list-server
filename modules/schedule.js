require('dotenv').config()
const { postData, getData } = require('../services/axios')
const { wlServer } = require('../services/servers')

//מחזיר את כל השעות המתאימות לפילטר שנשלח
async function getAll(condition) {
    try {
        let ans = await postData(wlServer, `/read/readMany/poolDaySchedule`, { condition })
        return ans
    }
    catch (error) {
        console.log({ error })
        throw error
    }
}

//  פונקציה להוספת שעה רצויה למערכת השעות
async function addGenderHour(genderHour) {

    try {
        let check = await postData(wlServer, '/read/exist/poolDaySchedule', { condition: genderHour })
        if (check.data === false) {
            let tempItem = { ...genderHour }
            tempItem.endHour = tempItem.startHour
            const { startHour, ...beforeItem } = tempItem
            check = await postData(wlServer, '/read/exist/poolDaySchedule', { condition: beforeItem })
            if (check.data === false) {
                tempItem = { ...genderHour }
                tempItem.startHour = tempItem.endHour
                const { endHour, ...afterItem } = tempItem
                check = await postData(wlServer, '/read/exist/poolDaySchedule', { condition: afterItem })
                if (check.data === false) {
                    const newGenderHour = { ...genderHour, addedDate: new Date().toISOString(), userName: 'develop', disabled: 0 }
                    const newId = await postData(wlServer, '/create/createOne', { entity: 'poolDaySchedule', values: newGenderHour })
                    console.log(newId);
                    const response = await getData(wlServer, `read/readOne/poolDaySchedule/${newId.data[0].id}`)
                    return response.data
                }
                else {
                    const response = await postData(wlServer, '/read/readOne/poolDaySchedule', { condition: afterItem })
                    if (response.data.id) {
                        const updateItem = response.data
                        const answer = updateOneSchedule({
                            set: { startHour: genderHour.startHour },
                            condition: { id: updateItem.id }
                        })
                        console.log({ answer })
                        return answer
                    }

                }
            }
            else {
                const response = await postData(wlServer, '/read/readOne/poolDaySchedule', { condition: beforeItem })
                if (response.data.id) {
                    const updateItem = response.data
                    const answer = updateOneSchedule({
                        set: { endHour: genderHour.endHour },
                        condition: { id: updateItem.id }
                    })
                    console.log({ answer })
                    return answer
                }
            }

        }
        else {
            const error = { number: 500 }
            error.message = 'data exists'
            throw new Error(error)
        }
    }
    catch (error) {
        throw new Error(error)
    }
}

// .פונקציה לעידכון שעה ממערכת השעות (מקבלת שם בריכה ,יום , ושעת התחלה)
async function updateOneSchedule(data) {

    try {
        const updateResponse = await postData(wlServer, '/update/updateOne', {
            entity: 'poolDaySchedule',
            data,

        })
        console.log({ updateResponse })
        if (updateResponse.status === 201) {
            return updateResponse.data
        }
        else {
            return data
        }
        // if (updateResponse.status === 204) {
        //     const updateItem = await postData(wlServer, '/read/readOne/poolDaySchedule', {
        //         condition
        //     })
        //     return updateItem.data
        // }
    }
    catch (error) {
        console.log({ error });
        throw new Error(error)
    }
}

// .פונקציה שמקבלת שם בריכה,יום ושעת התחלה ומחזירה את האוביקט של השעה הזאת
async function getHour(obj, arr) {
    let filter
    switch (arr) {

        case 'activeHours':
            filter = { 'poolName': obj.poolName, 'schedule.day': obj.day, 'schedule.day.startActiveHour': obj.startActiveHour }
            break;
        case 'hours':
            filter = { 'poolName': obj.poolName, 'schedule.day': obj.day, 'schedule.hours.startHour': obj.startHour }
            break;
    }
    try {
        let ans = await postData(wlServer, '/crud_db/update', { entity: 'SwimmingPool', filter: filter, update: set, options: arrayFilters })
        return ans
    }
    catch (error) {
        throw new Error(error)
    }
}

// . פונקציה שמקבלת שם בריכה ויום ומוחקת את  אותו היום מהמערכת
async function deleteDay(obj) {
    const { id } = obj
    condition = { id }
    try {
        let ans = await postData(wlServer, '/delete/deleteOne', { entity: 'poolDaySchedule', data: obj, condition })
        return ans.data
    }
    catch (error) {
        throw new Error(error)
    }
}

//מוחקת שעה רצויה מהמערכת
async function deleteHour(obj, arr) {
    console.log('obj', obj);
    console.log('arr', arr);
    let filter = { "poolName": obj.poolName, "schedule.day": obj.day }
    let pull
    switch (arr) {
        case 'activeHours':
            pull = { $pull: { 'schedule.$.activeHours': { startActiveHour: obj.startActiveHour } } }
            break;
        case 'hours':
            pull = { $pull: { 'schedule.$.hours': { startHour: obj.startHour } } }
            break;
    }
    try {
        let ans = await postData(wlServer, '/crud_db/update', { entity: 'SwimmingPool', filter: filter, update: pull })
        console.log('ans', ans.data);
        return ans
    }
    catch (error) {
        throw new Error(error)
    }
}

async function findGenderDaysByPools(condition) {
    try {
        console.log(condition);
        const ans = await postData(wlServer, '/read/readMany/poolDaySchedule', { condition })
        console.log(ans, 'ans');
        if (ans.data)
            return ans.data
        else
            return 'not found'
    }
    catch (error) {
        throw error
    }
}
module.exports = { addGenderHour, updateOneSchedule, getHour, deleteDay, deleteHour, getAll, findGenderDaysByPools }
