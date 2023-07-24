const express = require('express');
const router = express.Router();
const { insertPatient, deleteById, findPatientesByFeature, basicupdate, insert, deletePatientById, getAllWaitingPatient
    , getAllDeletedOrEmbededPatient, getAllWaitingPatientOrderedByPreference, updateRemarksArray } = require('../modules/patient');

router.get('/findPatientesByFeature/:featureName/:featureValue', async (req, res) => {
    try {
        const response = await findPatientesByFeature(req.params.featureName, req.params.featureValue);
        res.status(200).send(response.data);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})
router.post('/basicupdate', express.json(), async (req, res) => {
    try {
        const response = await basicupdate(req.body.obj1, req.body.obj2);
        res.status(200).send(true)
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})


router.post('/insertPatient', express.json(), async (req, res) => {
    try {
        const response = await insertPatient(req.body);
        res.status(200).send(response.data);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/updateAnArray', express.json(), async (req, res) => {
    try {
        const response = await updateRemarksArray(req.body.id, req.body.remark);
        res.status(200).send(response.data);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/getAllWaitingPatient/:length/:indexStart', async (req, res) => {
    try {
        const response = await getAllWaitingPatient(req.params.length, req.params.indexStart);
        res.status(200).send(response.data);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/getAllDeletedOrEmbededPatient/:status/:length/:indexStart', async (req, res) => {
    try {
        const response = await getAllDeletedOrEmbededPatient(req.params.status, req.params.length, req.params.indexStart);
        res.status(200).send(response.data);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/getAllWaitingPatientOrderedByPreference/:length/:indexStart', async (req, res) => {
    try {
        const response = await getAllWaitingPatientOrderedByPreference(req.params.length, req.params.indexStart);
        res.status(200).send(response.data);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/delete', express.json(), async (req, res) => {
    try {
        const response = await deleteById(req.body)
        if (response) {
            res.status(200).send(response.data)
        }
        else {
            res.status(500).send(response)
        }
    }
    catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router;


