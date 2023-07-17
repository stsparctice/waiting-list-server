const express = require('express');
const router = express.Router();
const { findPatientesByFeature, basicupdate, insert ,deletePatientById} = require('../modules/patient');

router.get('/findPatientesByFeature/:featureName/:featureValue', async (req, res) => {
    const patients = await findPatientesByFeature(req.params.featureName, req.params.featureValue);
    if (patients) {
        res.status(200).send(patients);
    }
    else {
        res.status(404)
    }
})
router.post('/basicupdate', express.json(), async (req, res) => {
    const list = await basicupdate(req.body.obj1, req.body.obj2);
    if (list) {
        res.status(200).send(true)
    }
    else {
        res.status(404).send(false)
    }
})


router.post('/insertPatient', express.json(), async (req, res) => {
    const response = await insert(req.body);
    res.status(200).send(response.data);
})

// router.get('/findPatientesByFeature',async(req,res)=>{
//     const patients = await findPatientesByFeature("name","ruti")
//     res.status(200).send(patients)
// })


router.post('/delete',express.json(),async(req,res)=>{
    const ans = await deletePatientById(req.body)
    if(ans){
        res.status(200).send(ans)
    }
    else{
        res.status(404).send(ans)
    }
})

module.exports = router;


