require('dotenv').config();
const { getData, postData, dbServer } = require('../services/axios')

async function insertPatient(body) {
    try {
        const patient = await postData(dbServer, '/create_db/createOne', {
            entity: 'Patient', values: {
                IdentityCard: body.id
                , FirstName: body.firstName
                , LastName: body.lastName
                , Phone1: body.phone1
                , Phone2: body.phone2
                , BirthDate: body.birthDate
                , Sex: body.sex
                , PriceList: body.priceList
                , Evaluated: body.evaluated
                , LastEvaluationDate: body.lastEvaluationDate
                , SendMedDocumentsDate: body.sendMedDocumentsDate
                , addedDate: new Date()
                , UserName: body.userName
                , Disable: false
            }
        })
        return patient.data;
    } catch (error) {
        return error;
    }
}

// async function deletePatientById(body) {
//     // if (body.ID) {
//     const patient = await postData(dbServer, '/read_db/readOne', { entity: 'Patient', condition: { id: body.ID } })
//     if (patient.data) {
//         const p = patient.data[0]
//         await postData(dbServer, '/create_db/createOne', {
//             entity: 'Patient',
//             values: `'${p.id}','${p.name}','${p.medicalDocsDate}','${p.selectedGenders}','${p.treatmentLevel}','${p.treatmentPreference}' ,'${p.evaluated}','${p.evaluationDate}','${p.remarks}'`
//         })
//         for (let i of p.swimmingPools) {
//             await postData(dbServer, '/create_db/createOne', {
//                 entity: 'patientSwimmingPools',
//                 values: `'${p.id}','${i}'`
//             })
//         }
//         for (let i of p.teachers) {
//             await postData(dbServer, '/create_db/createOne', {
//                 entity: 'patientTechers',
//                 values: `'${p.id}','${i.name}','${i.desired}'`
//             })
//         }
//         for (let i of p.days) {
//             await postData(dbServer, '/create_db/createOne', {
//                 entity: 'patientDays',
//                 values: `'${p.id}','${i.day}','${i.start}','${i.end}'`
//             })
//         }

//         await postData(dbServer, '/delete_db/deleteOne', { entity: 'Patient', condition: { id: body.ID } })
//     }
//     return patient.data;
//     // }
//     // else{
//     //     return false;
//     // }
// }

async function deleteById(body) {
    if (body.ID) {
        const patient = await getData(dbServer, `/read_db/readOne/Patient?IdentityCard=${body.ID}`)
        if (patient.data) {
            await postData(dbServer, '/delete_db/deleteOne', { entity: 'Patient', condition: { IdentityCard: body.ID }, set: { DisabledDate: body.disableDate, DisableUser: body.disableUser } })
        }
    }
}

async function basicupdate(query1 = {}, update) {
    try {
        if (!update) {
            throw new error
        }
        const response = await postData(dbServer, '/update_db/update', { entity: 'Patient', condition: query1, set: update })
        return response;
    }
    catch (error) {
        throw error
    }
}

async function findPatientesByFeature(featureName, featureValue) {
    try {
        if (!featureName || !featureValue) {
            throw new error
        }
        const response = await postData(dbServer, '/read_db/readMany', { entity: 'Patients', condition: { [featureName]: { $regex: featureValue } } })
        return response
    }
    catch (error) {
        throw error
    }
}

async function insert(patientDitales) {
    try {
        if (!patientDitales) {
            throw new error
        }
        const response = await postData(dbServer, '/crud_db/insert', { entity: 'Patients', ...patientDitales, date: new Date().toISOString() })
        return response;
    }
    catch (error) {
        return error;
    }
}

async function updateRemarksArray(patientId, remark) {
    try {
        if (!patientId || !remark) {
            throw new error
        }
        const response = await postData(dbServer, '/crud_db/update', { entity: 'Patients', condition: { id: patientId }, update: { $push: { remarks: remark } } })
        return response;
    }
    catch (error) {
        return error;
    }
}

async function deletePatientById(body) {
    if (!body.ID) {
        // throw new error
        return "no id to delete"
    }
    if (!body.status) {
        // throw new error
        return "no status"
    }
    let patient
    try {
        patient = await postData(dbServer, '/crud_db/read', { entity: 'Patients', condition: { id: body.ID } })
    }
    catch (error) {
        return error;
    }
    if (patient.data) {
        const date = new Date().toISOString()
        const p = patient.data[0]
        try {
            await postData(dbServer, '/crud_db/insert', {
                entity: 'patient',
                values: `'${p.id}','${p.name}','${body.status}','${date}','${p.medicalDocsDate}','${p.selectedGenders}','${p.treatmentLevel}','${p.treatmentPreference}' ,'${p.evaluated}','${p.evaluationDate}','${p.user}','${p.remarks}'`
            })
        }
        catch (error) {
            return error;
        }
        for (let i of p.swimmingPools) {
            try {
                await postData(dbServer, '/crud_db/insert', {
                    entity: 'patientSwimmingPools',
                    values: `'${p.id}','${i}'`
                })
            }
            catch (error) {
                return error;
            }

        }
        for (let i of p.teachers) {
            try {
                await postData(dbServer, '/crud_db/insert', {
                    entity: 'patientTechers',
                    values: `'${p.id}','${i.name}','${i.desired}'`
                })
            }
            catch (error) {
                return error;
            }
        }
        for (let i of p.days) {
            try {
                await postData(dbServer, '/crud_db/insert', {
                    entity: 'patientDays',
                    values: `'${p.id}','${i.day}','${i.start}','${i.end}'`
                })
            }
            catch (error) {
                return error;
            }
        }
        try {
            await postData(dbServer, '/crud_db/delete', { entity: 'Patients', condition: { id: body.ID } })
        }
        catch (error) {
            throw error
        }
    }
    return patient;
}

async function getAllWaitingPatient(length = 100, indexStart = 0) {
    try {
        const len = parseInt(indexStart) + parseInt(length)
        const response = await postData(dbServer, '/read_db/readMany',
            { entity: 'Patients', project: { 'skip': indexStart, 'limit': len } })
        updateTreatmentPreference(response.data)
        return response
    }
    catch (error) {
        throw error
    }
}

async function getAllWaitingPatientOrderedByPreference(length = 100, indexStart = 0) {
    try {
        length = parseInt(indexStart) + parseInt(length)
        let patients
        if (indexStart > 0) {
            patients = await postData(dbServer, '/read_db/readMany', { entity: 'patient', columns: '*', condition: { Disabled: true }, n: length })
            if (patients.data.length > 0)
                patients.data = patients.data.slice(indexStart)
        } else {
            patients = await postData(dbServer, '/read_db/readMany', { entity: 'patient', columns: '*', condition: { Disabled: true }, n: length })
        }
        if (patients.data.length > 0) { sortByPreference(patients.data) }
        return patients
    }
    catch (error) {
        throw error
    }
}


function sortByPreference(patients) {
    const HighPrefernce = []
    const mediumPrefernce = []
    const lowPrefernce = []
    for (let p of patients) {
        if (p.treatmentPreference == "גבוהה") {
            HighPrefernce.push(p)
        }
        else if (p.treatmentPreference == "בינונית") {
            mediumPrefernce.push(p)
        }
        else {
            lowPrefernce.push(p)
        }
    }
    if (HighPrefernce.length < 100) {
        HighPrefernce.push(mediumPrefernce.splice(0, 100 - HighPrefernce.length))
        if (HighPrefernce.length < 100) {
            HighPrefernce.push(lowPrefernce.splice(0, 100 - HighPrefernce.length))
        }
    }
    return HighPrefernce
}

async function getAllDeletedOrEmbededPatient(length = 100, indexStart = 0) {
    try {
        length = parseInt(indexStart) + parseInt(length)
        let patients
        if (indexStart > 0) {
            patients = await postData(dbServer, '/read_db/readMany', { entity: 'patient', columns: '*', condition: { Disabled: false }, n: length })
            // console.log(patients);
            if (patients.data.length > 0)
                patients.data = patients.data.slice(indexStart)
        } else {
            patients = await postData(dbServer, '/read_db/readMany', { entity: 'patient', columns: '*', condition: { Disabled: false }, n: length })
            // console.log(patients)
        }
        return patients
    }
    catch (error) {
        throw error
    }
}

async function updateTreatmentPreference(patients) {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    // console.log(day, month, year, date);
    for (let p of patients) {
        checkUpdatepreference(p, day, month, year)
    }
}

async function checkUpdatepreference(patient, day, month, year) {
    const dateP = new Date(patient.medicalDocsDate)
    const dayP = dateP.getDate()
    const monthP = dateP.getMonth() + 1
    const yearP = dateP.getFullYear()

    if (patient.treatmentPreference != "גבוהה") {
        if ((month - monthP > 3) || (month - monthP == 3 && day >= dayP) ||
            (year > yearP && ((Math.abs(month - monthP) == 9 && day >= dayP) ||
                (Math.abs(month - monthP) > 6 && Math.abs(month - monthP) < 9) || (Math.abs(month - monthP) == 6 && day < dayP)))) {
            // if (patient.treatmentPreference === "נמוכה") {
            await basicupdate({ "id": patient.id }, { "treatmentPreference": "בינונית" })
            // }
        }
        // else {
        if ((month - monthP > 6) || (month - monthP == 6 && day >= dayP) ||
            (year > yearP && ((Math.abs(month - monthP) == 6 && day >= dayP) || Math.abs(month - monthP) <= 6))) {
            await basicupdate({ "id": patient.id }, { "treatmentPreference": "גבוהה" })
        }
        // }
    }
}

module.exports = { insertPatient, deleteById, updateRemarksArray, findPatientesByFeature, insert, basicupdate, deletePatientById, getAllWaitingPatient, getAllDeletedOrEmbededPatient, getAllWaitingPatientOrderedByPreference }
