const express = require('express');
const router = require('express').Router()
const {httpLogger} = require('../services/logger/http-logger')
const { add, find, update, deleted } = require('../modules/gender')

router.get('/find/:name', httpLogger(), async (req, res) => {
    
    let ans = await find({ name: req.params.name ,disabled: 0})
    res.send(ans)
})
router.get('/getAll', async (req, res) => {
    try{
    let ans = await find({ disabled: 0 })
    res.status(200).send(ans)
    }
    catch (error){
        res.status(500).send(error)
    }
})
router.post('/add', express.json(), httpLogger(),async (req, res) => {
    try{
    let ans = await add(req.body)
    res.status(ans.status).send(ans.data)
    }
    catch(error){
        res.status(500).send(error.message)
    }
})
router.post('/update', express.json(), async (req, res) => {
    console.log(req.body);
    let ans = await update(req.body.oldName, req.body.name, req.body.sex, req.body.mmaxAge, req.body.fmaxAge, req.body.genderColor)
    res.send(ans.data)
})
router.post('/delete', express.json(), async (req, res) => {
    let ans = await deleted(req.body.name)
    res.send(ans)
})
module.exports = router