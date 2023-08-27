const express = require('express')
const router = express.Router()
const { deleteTeacher, insertTeacher, updateTeacher, findOneTeacher, findAllTeachers, findTeacherByCondition, findAllDisabledTeachers } = require('../modules/teachers')

// insert  //
router.post('/insertTeacher', express.json(), async (req, res) => {
    try {
        const ans = await insertTeacher(req.body)
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
router.post('/updateTeacher', express.json(), async (req, res) => {
    try {
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
            res.status(500).send({ message: 'not found' })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/findAllTeachers', async (req, res) => {
    try {
        const ans = await findAllTeachers()
        if (ans)
            res.status(ans.status).send(ans.data)
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
        console.log({error})
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

module.exports = router
