const express = require('express')
const router = express.Router()
const { addGenderHour, deleteDay, deleteHour, getAll, findGenderDaysByPools,updateOneSchedule} = require('../modules/schedule')
const { sortSchedule } = require('../modules/checkScedule')

// בקשה לקבלת  שעות פעילות בריכה מסוימת
router.get('/getAllActiveHours/:poolId', async (req, res) => {
    console.log('api')
    try {
       
        const condition = req.query
        condition.swimmingPoolId = req.params.poolId
        condition.disabled = 0
        console.log({condition})
        const ans = await getAll( condition)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})

// בקשה לקבלת  שעות פעילות בריכה מסוימת
router.get('/getAllHours/:poolName', async (req, res) => {

    try {
        const filter = { 'poolName': req.params.poolName }
        const project = { 'schedule.day': 1, 'schedule.hours': 1, '_id': 0 }
        const ans = await getAll(filter, project)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})
// בקשה לקבלת  שעות פעילות בריכה מסוימת לפי יום, שעות מפורטות
router.get('/getAllActiveHoursByDay', async (req, res) => {
    try {
        const filter = { 'poolName': req.query.poolName, 'schedule.day': req.query.day }
        let project = { 'schedule.activeHours.$': 1, '_id': 0 }
        const ans = await getAll(filter, project)
        res.status(200).send(sortSchedule(ans.data[0].schedule[0]))
    }
    catch (error) {
        res.status(404).send(error)
    }
})
////////////// בעיה - הפונקציה מחזירה את כל השעות של יום זה 
// פונקציה שמקבלת שם בריכה יום ושעת התחלה ומחזירה באוביקט את הנתונים של שעה זו
router.post('/getActiveHour', express.json(), async (req, res) => {
    let filter = { 'poolName': req.body.poolName, 'schedule.day': req.body.day, 'schedule.day.startActiveHour': req.body.startActiveHour }
    let project = { 'schedule.activeHours.$': 1, '_id': 0 }
    try {
        const ans = await getAll(filter, project)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})
///////////////////////////////
// בקשה לקבלת שעות קבוצות  בבריכה מסוימת לפי יום
router.get('/getAllHoursByDay', async (req, res) => {
    try {
        let filter = { 'poolName': req.query.poolName, 'schedule.day': req.query.day }
        // let filter = { 'poolName': req.query.poolName, 'schedule.day': req.query.day }
        let project = { 'schedule.hours.$': 1, '_id': 0 }
        const ans = await getAll(filter, project)
        res.status(200).send(sortSchedule(ans.data[0].schedule[0]))
    }
    catch (error) {
        res.status(404).send(error)
    }
})
//????????????????????????????????????
// בקשה לקבלת שעות קבוצות בבריכה מסוימת לפי סוג קבוצה
router.post('/getAllHoursByGender', express.json(), async (req, res) => {
    try {
        let filter = { 'poolName': req.query.poolName, 'schedule.day': req.query.day }
        let project = { 'schedule.hours.$': 1, '_id': 0 }
        const ans = await getAll(filter, project)
        res.status(200).send(sortSchedule(ans.data[0].schedule[0]))
    }
    catch (error) {
        res.status(404).send(error)
    }
})

////////////// בעיה - הפונקציה מחזירה את כל השעות של יום זה 
// פונקציה שמקבלת שם בריכה יום ושעת התחלה ומחזירה באוביקט את הנתונים של שעה זו
router.post('/getHour', express.json(), async (req, res) => {
    let filter = { 'poolName': req.body.poolName, 'schedule.day': req.body.day, 'schedule.day.startHour': req.body.startHour }
    let project = { 'schedule.hours.$': 1, '_id': 0 }
    try {
        const ans = await getAll(filter, project)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})

// בקשה להוספת יום פעילות לבריכה(בריכה,יום,שעת התחלה ושעת סיום) 
router.post('/addActiveHour', express.json(), async (req, res) => {
    try {
        let arr = 'activeHours'
        let ans = await addHour(req.body, arr)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})
// בקשה להוספת שעות פעילות לקבוצה (מקבלת בריכה,יום,שעת התחלה ,שעת סיום וקבוצה)
router.post('/addGenderHour', express.json(), async (req, res) => {
    console.log(req.body)
    try {
        const ans = await addGenderHour(req.body)
        console.log({ans})
        res.status(200).send(ans)
    }
    catch (error) {
        console.log({error})
        res.status(404).send(error)
    }
})


// בקשה לעידכון שעת פעילות בריכה לפי יום (מקבלת בריכה,יום ושני אוביקטים :האוביקט לעידכון והאוביקט החדש-כל אוביקט מכיל :שעת התחלה ושעת סיום)
router.post('/update', express.json(), async (req, res) => {
    try {
        const ans = await updateOneSchedule(req.body)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})
// בקשה לעידכון שעות פעילות לקבוצה (מקבלת בריכה,יום ושני אוביקטים:האוביקט לעדכון והאוביקט החדש :כל אוביקט מכיל שעת התחלה שעת סיום וקבוצה)
router.post('/updateHourByDay', express.json(), async (req, res) => {
    try {
        let arr = "hours"
        const ans = await updateHour(req.body, arr)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})


//בקשה למחיקת יום פעילות בריכה (מקבלת בריכה,יום)
router.post('/deleteDay', express.json(), async (req, res) => {
    try {
        const ans = await deleteDay(req.body)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})
// בקשה למחיקת שעת פעילות בריכה לפי יום (מקבלת בריכה,יום,שעת התחלה ושעת סיום) 
router.post('/deleteActiveHourByDay', express.json(), async (req, res) => {
    try {
        let arr = "activeHours"
        const ans = await deleteHour(req.body, arr)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})

// בקשה למחיקת שעות פעילות לקבוצה (מקבלת בריכה,יום,שעת התחלה ,שעת סיום וקבוצה)
router.post('/deleteHourByDay', express.json(), async (req, res) => {
    try {
        let arr = "hours"
        const ans = await deleteHour(req.body, arr)
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(404).send(error)
    }
})
//מביא ימים לפי ברכה וקבוצה
router.post('/findGenderDaysByPools', express.json(), async (req, res) => {
    try {
        //{condition:{swimmingPoolId:1,genderId:1}}
        console.log(req.body,'rrrrrrrrrrrrrrr');
        const ans = await findGenderDaysByPools(req.body.condition)
        console.log(ans, 'ans');
        if (ans)
            res.status(201).send(ans)
        else
            res.status(500).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
module.exports = router