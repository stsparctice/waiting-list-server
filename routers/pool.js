const express = require('express');

const router = require('express').Router()
const { add, update, find, deleted } = require('../modules/pool')

//insert

router.post('/add', express.json(), async (req, res) => {
    try {
        let ans = await add(req.body,new Date())
        res.status(ans.status).send(ans)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

//read

router.post('/find', express.json(), async (req, res) => {
    try {
        let ans = await find(req.body,{project:req.body.project})
        res.status(ans.status).send(ans)
    }
    catch (error) {
        res.status(500).send(error.message)

    }
})

//readAll

router.get('/getAll',express.json(), async (req, res) => {
    try {
        let ans = await find({ disabled: { $exists: false } },{project:{schedule:0}})
        res.status(ans.status).send(ans)
    }
    catch (error) {
        res.status(500).send(error.message)

    }
})

//update

router.post('/update', express.json(), async (req, res) => {
    try {
        let ans = await update(req.body)
        res.status(ans.status).send(ans)
    }
    catch (error) {
        res.status(500).send(error.message)

    }
})
//delete

router.post('/delete', express.json(), async (req, res) => {
    try {
        let ans = await deleted(req.body)
        res.status(ans.status).send(ans)
    }
    catch(error){
        res.status(500).send(error.message)

    }
})
module.exports = router