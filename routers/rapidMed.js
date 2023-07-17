const express = require('express');

const router = require('express').Router()
const { readDetails } = require('../modules/rapidMed')

router.post('/find', express.json(), async (req, res) => {
    try {
        patient= await readDetails(req.body.id)
        console.log('patient',patient);
        res.status(200).send(patient)
    }
    catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router 