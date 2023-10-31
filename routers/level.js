const express = require('express');

const router = require('express').Router()
const { add, update, find, deleted } = require('../modules/level');
const { httpLogger } = require('../services/logger/http-logger');

router.post('/add', express.json(),httpLogger(), async (req, res) => {
    try {
    
        let ans = await add(req.body.name, req.body.color, new Date())
        console.log({ans})
        res.status(200).send(ans)
    }
    catch (error) {
        res.status(500).send(error)
    }
})
router.get('/find/:levelName', async (req, res) => {
    try {
        let ans = await find({ poolName: req.params.levelName })
        res.status(200).send(ans)
    }
    catch (error) {
        res.status(500).send(error)

    }
})
router.get('/getAll',  async (req, res) => {
    try {
        let ans = await find({ disabled: 0})
        console.log({ans})

        res.status(200).send(ans)
    }
    catch (error) {
        res.status(500).send(error)

    }
})
router.post('/update', express.json(), async (req, res) => {
    try {
        let ans = await update(req.body)
        console.log({ans})
        res.status(ans.status).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error)

    }
})
router.post('/delete', express.json(), async (req, res) => {
    try {
        let ans = await deleted(req.body)
        res.status(200).send(ans)
    }
    catch(error){
        res.status(500).send(error)

    }
})
module.exports = router