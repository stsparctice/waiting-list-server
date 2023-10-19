const express = require('express');

const router = require('express').Router()
const { readDetails } = require('../modules/rapidMed')

router.get('/find', async (req, res) => {
console.log('find')
    try {
        patient= await readDetails(req.query.id)
        console.log('patient',patient.entitiesFields);
        res.status(200).send(patient)
    }
    catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router 