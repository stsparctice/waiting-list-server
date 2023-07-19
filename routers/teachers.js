const express = require('express')
const router = express.Router()
const { deleteTeacher, insertTeacher, findTeacher, updateTeacher, findDisabledTeachers } = require('../modules/teachers')

// insert  //
router.post('/insertTeacher', express.json(), async (req, res) => {
    try {
        const ans = await insertTeacher(req.body)
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

//delete//
router.post('/deleteTeacher', express.json(), async (req, res) => {
    try {
        const ans = await deleteTeacher(req.body);
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

// read //
router.get('/findTeacher', async (req, res) => {
    try {
        const ans = await findTeacher(req.query)
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
router.post('/findTeacherByFilter', express.json(), async (req, res) => {
    const ans = await findTeacher({ $or: req.body.filter })
    res.send(ans)
})

//update //
router.post('/updateTeacher', express.json(), async (req, res) => {
    try {
        const ans = await updateTeacher({ name: req.body.name }, req.body.update)
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

//read from sql//
router.get('/findDisabledTeachers', async (req, res) => {
    try {
        const ans = await findDisabledTeachers()
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router
