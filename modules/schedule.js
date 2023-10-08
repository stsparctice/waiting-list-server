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
        console.log({check})
        if (check.data===false) {
            const newGenderHour = { ...genderHour, addedDate: new Date().toISOString(), userName: 'develop', disabled: 0 }
            const newId = await postData(wlServer, '/create/createOne', { entity: 'poolDaySchedule', values: newGenderHour })
            const response = await getData(wlServer,`read/readOne/poolDaySchedule/${newId.data[0].Id}`)
            return response.data
        }
        else{
            const error = {number:500}
            error.message = 'data exists'
            throw new Error(error)
        }
    }
    catch (error) {
        throw new Error(error)
    }
}

// .פונקציה לעידכון שעה ממערכת השעות (מקבלת שם בריכה ,יום , ושעת התחלה)
async function updateHour(obj, arr) {
    let filter
    let set
    let arrayFilters
    switch (arr) {
        case 'activeHours':
            filter = { 'poolName': obj.poolName }
            set = { $set: { "schedule.$[d].activeHours.$[a]": { "startActiveHour": obj.new.startHour, "endActiveHour": obj.new.endHour } } }
            arrayFilters = { arrayFilters: [{ 'a.startActiveHour': obj.old.startHour }, { 'd.day': obj.day }] }
            break;
        case 'hours':
            filter = { 'poolName': obj.poolName }
            set = { $set: { "schedule.$[d].hours.$[a]": { "startHour": obj.new.startHour, "endHour": obj.new.endHour } } }
            arrayFilters = { arrayFilters: [{ 'a.startHour': obj.old.startHour }, { 'd.day': obj.day }] }
            break;
    }
    try {
        return await postData(wlServer, '/crud_db/update', { entity: 'SwimmingPool', filter: filter, update: set, options: arrayFilters })
    }
    catch (error) {
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
    const filter = { 'poolName': obj.poolName }
    let pull = { $pull: { 'schedule': { 'day': obj.day } } }
    try {
        let ans = await postData(wlServer, '/crud_db/update', { entity: 'SwimmingPool', filter: filter, update: pull })
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

module.exports = { addGenderHour, updateHour, getHour, deleteDay, deleteHour, getAll }
