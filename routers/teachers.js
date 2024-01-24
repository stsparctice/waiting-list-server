const express = require('express')
const router = express.Router()
const { deleteTeacher, insertTeacher, insertPoolToTeacher, updateTeacher, findOneTeacher, findAllTeachers, findTeacherByCondition, findAllDisabledTeachers, findTeacherByPoolAndGender,
     getTeachersLevels,
     getTeachersGenders,
     getTeachersPools } = require('../modules/teachers')
const { httpLogger } = require('../services/logger/http-logger')

// insert  //
router.post('/insert', express.json(), httpLogger(), async (req, res) => {
    try {
        const ans = await insertTeacher(req.body)

        if (ans) {
            res.status(201).send(ans)

        }
        else {
            res.status(500).send({ message: 'no create' })
        }
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/addPoolToTeacher', express.json(), async (req, res) => {
    try {
        const ans = await insertPoolToTeacher(req.body)
        if (ans) {
            res.status(200).send(ans.data)
        }
        else {
            res.status(500).send({ message: 'no create' })
        }
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

//delete//
router.post('/deleteTeacher', express.json(), async (req, res) => {
    try {
        const ans = await deleteTeacher(req.body);
        if (ans)
            res.status(ans.status).send(ans.data)
        else
            res.status(500).send({ message: 'no delete' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

//update //
router.post('/update', express.json(), async (req, res) => {
    try {
        console.log('update')

        const ans = await updateTeacher(req.body)
        if (ans) {
            res.status(ans.status).send(ans.data)
        }
        else {
            res.status(500).send({ message: 'no update' })
        }
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

// read //
router.get('/findOneTeacher', async (req, res) => {
    try {
        const ans = await findOneTeacher(req.query)
        if (ans)
            res.status(ans.status).send(ans.data)
        else
            res.status(404).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/teacherlevels/:teacherid', async (req, res) => {
    try {
        const { teacherid } = req.params
        const result = await getTeachersLevels(teacherid)
        if (result) {
            res.status(200).send(result)
        }
        else
            res.status(404).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/teachergenders/:teacherid', async (req, res) => {
    try {
        const { teacherid } = req.params
        const result = await getTeachersGenders(teacherid)
        if (result) {
            res.status(200).send(result)
        }
        else
            res.status(404).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/teacherpools/:teacherid', async (req, res) => {
    try {
        const { teacherid } = req.params
        const result = await getTeachersPools(teacherid)
        if (result) {
            res.status(200).send(result)
        }
        else
            res.status(404).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/all', async (req, res) => {
    try {
        const ans = await findAllTeachers()
        if (ans)
            res.status(200).send(ans.data)
        else
            res.status(500).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/findTeacherByCondition', express.json(), async (req, res) => {
    try {
        console.log(req.body);
        const ans = await findTeacherByCondition(req.body)
        if (ans)
            res.status(ans.status).send(ans.data)
        else
            res.status(500).send({ message: 'not found' })
    }
    catch (error) {
        console.log({ error })
        res.status(500).send(error.message)
    }
})

//read disabled teachers from sql//
router.get('/findAllDisabledTeachers', async (req, res) => {
    try {
        const ans = await findAllDisabledTeachers()
        if (ans)
            res.status(ans.status).send(ans.data)
        else
            res.status(500).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/findTeacherByPoolAndGender', express.json(), async (req, res) => {
    try {
        const ans = await findTeacherByPoolAndGender(req.body)
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
