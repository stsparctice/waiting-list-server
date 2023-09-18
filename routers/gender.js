const express = require('express');
const router = require('express').Router()
const { httpLogger } = require('../services/logger/http-logger')
const { add, find, update, deleted } = require('../modules/gender')

router.get('/find/:name', httpLogger(), async (req, res) => {

    let ans = await find({ name: req.params.name, disabled: 0 })
    res.send(ans)
})
router.get('/getAll', async (req, res) => {
    try {
        let ans = await find({ disabled: 0 })
        res.status(200).send(ans)
    }
    catch (error) {
        res.status(500).send(error)
    }
})
router.post('/add', express.json(), httpLogger(), async (req, res) => {
    try {
        let ans = await add(req.body)
        console.log({ ans })
        if (ans.id) {
            res.status(200).send(ans)
        }
        else {
            throw new Error('data is not correct')
        }
    }
    catch (error) {
        console.log({ error })
        res.status(500).send(error.message)
    }
})
router.post('/update', express.json(), async (req, res) => {
    try {
        console.log(req.body);
        let ans = await update(req.body)
        res.status(204).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
router.post('/delete', express.json(), async (req, res) => {
    try {
        let ans = await deleted(req.body)
        res.status(200).send(ans)
    }
    catch (error) {
        console.log({ error })
        res.status(500).send(error.message)
    }
})
module.exports = router