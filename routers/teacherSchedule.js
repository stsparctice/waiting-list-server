const express = require('express')
const router = express.Router()
const { insertTeacherSchedule, updateTeacherSchedule, findTeachersSchedule, findTeacherScheduleToSpecificTeacher } = require('../modules/teacher_schedule')



// insert
router.post('/insertTeacherSchedule', express.json(), async (req, res) => {
    let ans = await insertTeacherSchedule(req.body)
    if (ans)
        res.status(200).send(ans)
})


// // insert

router.post('/updateTeacherSchedule', express.json(), async (req, res) => {
    console.log(req.body)
    let ans = await updateTeacherSchedule(req.body.name, req.body.update)
    console.log(ans);
    res.send(ans)
})




// read 
router.get('/findTeachersSchedule', async (req, res) => {
    const ans = await findTeachersSchedule(req.query)
    if (ans)
        res.status(200).send(ans)
    else
        res.status(404).send("not found")
})


router.get('/findTeacherScheduleToSpecificTeacher/:name', async (req, res) => {
    const ans = await findTeacherScheduleToSpecificTeacher(req.params.name)
    if (ans)
        res.status(200).send(ans)
    else
        res.status(404).send("not found")
})


module.exports = router
