const express = require('express');
const router = require('express').Router()

const { add, find, update, deleted } = require('../modules/gender')

router.get('/find/:name', async (req, res) => {
    try {
        let ans = await find(req.params)
        res.status(ans.status).send(ans.data)

    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
router.get('/getAll', express.json(), async (req, res) => {
    try {
        let ans = await find({ disabled: { $exists: false } })
        console.log(ans);
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)

    }
})
router.post('/add', express.json(), async (req, res) => {
    try {
        let ans = await add(req.body)
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
router.post('/update', express.json(), async (req, res) => {
    try {
        let ans = await update(req.body)
        res.status(ans.status).send(ans.data)
    }
    catch {
        res.status(500).send(error.message)
    }
})
router.post('/delete', express.json(), async (req, res) => {
    try {
        let ans = await deleted(req.body)
        res.status(ans.status).send(ans.data)
    }
    catch {
        res.status(500).send(error.message)
    }
})
module.exports = router