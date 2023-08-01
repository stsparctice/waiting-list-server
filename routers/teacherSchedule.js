const express = require('express')
const router = express.Router()
const { insertTeacherSchedule, updateTeacherSchedule, findTeachersSchedule, findTeacherScheduleToSpecificTeacher } = require('../modules/teacher_schedule')

// insert
router.post('/insertTeacherSchedule', express.json(), async (req, res) => {
    try {
        const ans = await insertTeacherSchedule(req.body)
        if (ans)
            res.status(200).send(ans.data)
        else
            res.status(500).send({ message: 'no insert' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

// update
router.post('/updateTeacherSchedule', express.json(), async (req, res) => {
    try {
        let ans = await updateTeacherSchedule(req.body.name, req.body.update)
        if (ans)
            res.status(200).send(ans.data)
        else
            res.status(500).send({ message: 'no update' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

// read 
router.get('/findTeachersSchedule', async (req, res) => {
    try {
        const ans = await findTeachersSchedule(req.query)
        if (ans)
            res.status(200).send(ans)
        else
            res.status(500).send({ message: "not found" })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/findTeacherScheduleToSpecificTeacher/:name', async (req, res) => {
    try {
        const ans = await findTeacherScheduleToSpecificTeacher(req.params.name)
        if (ans)
            res.status(200).send(ans)
        else
            res.status(500).send({ message: "not found" })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router
