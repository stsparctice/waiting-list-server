require('dotenv').config();
const { getData, postData, dbServer } = require('../services/axios')

async function basicupdate(query1 = {}, update) {
    const response = await postData(dbServer, '/crud_db//update', { entity: 'Patients', filter: query1, update: { $set: update } })
    return response;
}

async function findPatientesByFeature(featureName, featureValue) {
    const patients = await postData(dbServer, '/crud_db/read', { entity: 'Patients', filter: { [featureName]: { $regex: featureValue } } })
    return patients.data
}

async function insert(patientDitales) {
    try {
        const patient = await postData(dbServer, '/crud_db/insert', { entity: 'Patients', ...patientDitales })
        return patient.data;
    } catch (error) {
        return error;
    }
}

async function deletePatientById(body) {
    // if (body.ID) {
    const patient = await postData(dbServer, '/crud_db/read', { entity: 'Patients', filter: { id: body.ID } })
    if (patient.data) {
        const p = patient.data[0]
        await postData(dbServer, '/crud_db/insert', {
            entity: 'patient',
            values: `'${p.id}','${p.name}','${p.medicalDocsDate}','${p.selectedGenders}','${p.treatmentLevel}','${p.treatmentPreference}' ,'${p.evaluated}','${p.evaluationDate}','${p.remarks}'`
        })
        for (let i of p.swimmingPools) {
            await postData(dbServer, '/crud_db/insert', {
                entity: 'patientSwimmingPools',
                values: `'${p.id}','${i}'`
            })
        }
        for (let i of p.teachers) {
            await postData(dbServer, '/crud_db/insert', {
                entity: 'patientTechers',
                values: `'${p.id}','${i.name}','${i.desired}'`
            })
        }
        for (let i of p.days) {
            await postData(dbServer, '/crud_db/insert', {
                entity: 'patientDays',
                values: `'${p.id}','${i.day}','${i.start}','${i.end}'`
            })
        }

        await postData(dbServer, '/crud_db/delete', { entity: 'Patients', filter: { id: body.ID } })
    }
    return patient.data;
    // }
    // else{
    //     return false;
    // }
}



module.exports = { findPatientesByFeature, insert, basicupdate, deletePatientById }
