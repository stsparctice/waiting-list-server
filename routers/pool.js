const express = require('express');

const router = require('express').Router()
const { add, update, find, deleted } = require('../modules/pool');
const { httpLogger } = require('../services/logger/http-logger');

router.post('/add', express.json(),httpLogger(), async (req, res) => {
    try {
    
        let ans = await add(req.body.poolName, req.body.poolColor, req.body.poolAddress,new Date())
        res.status(200).send(ans.data)
    }
    catch (error) {
        res.status(500).send(error)
    }
})
router.get('/find/:poolName', async (req, res) => {
    try {
        let ans = await find({ poolName: req.params.poolName })
        res.status(200).send(ans)
    }
    catch (error) {
        res.status(500).send(error)

    }
})
router.get('/getAll',  async (req, res) => {
    try {
        let ans = await find({ disabled: 0})
        res.status(200).send(ans)
    }
    catch (error) {
        res.status(500).send(error)

    }
})
router.post('/update', express.json(), async (req, res) => {
    try {
        let ans = await update(req.body.oldPoolName, req.body.poolName, req.body.poolColor, req.body.poolAddress)
        res.status(200).send(ans)
    }
    catch (error) {
        res.status(404).send(error)

    }
})
router.post('/delete', express.json(), async (req, res) => {
    try {
        let ans = await deleted(req.body.poolName)
        res.status(200).send(ans)
    }
    catch(error){
        res.status(404).send(error)

    }
})
module.exports = router