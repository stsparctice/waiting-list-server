require('dotenv').config();
const { getData, postData, dbServer } = require('../services/axios')

// work for patient table
async function insertPatient(body) {
    try {
        const patient = await postData(dbServer, '/create_db/createOne', {
            entity: 'Patient', values: [{
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
                , Disabled: 0
            }]
        })

        return patient.data;
    } catch (error) {
        return error;
    }
}

async function insertRestDetailes(body) {
    if (!body.id)
        return 'no id'
    const patient = findPatientById(body.id)
    if (patient.data.length > 0) {
        // Urgency =דחיפות

        let preferenceDays = []
        for (p of body.preferenceDays) {
            let day = await gostData(dbServer, '/read_db/readOne/PoolDaySchedule'
                , { condition: { SwimmingPoolId, Day, GenderId, startHour, EndHour } })
            day = day.data[0].Id
            preferenceDays.push(day)
        }
        await postData(dbServer, '/create_db/createMany', {
            entity: 'PatientPreferenceDays', values: [{
                PatientId: body.id
                , PoolDayScheduleId
                , StartHour
                , EndHour
                , AddedDate: new Date()
                , UserName: body.userName
                , Disabled: 0
            }]
        })
        await postData(dbServer, '/create_db/createMany', {
            entity: 'PatientPreferenceTeachers', values: [body.teachers.map(t => {
                return {
                    PatientId: body.id
                    , TeacherId: t.teacherName
                    , Preference: t.prefer
                    , AddedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }
            })]
        })
        await postData(dbServer, '/create_db/createMany', {
            entity: 'PatientsComment', values: [body.comments.map(c => {
                return {
                    patientId: body.id
                    , comment: c
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }
            })]
        })
        let gendersId = []
        for (g of body.genders) {
            let gender = await getData(dbServer, `/read_db/readOne/Genders?name=${g}`)
            gender = gender.data[0].Id
            gendersId.push(gender)
        }
        await postData(dbServer, '/create_db/createMany', {
            entity: 'PatientsGenders', values: [gendersId.map(g => {
                return {
                    patientId: body.id
                    , genderId: g
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }
            })]
        })
        let poolsId = []
        for (p of body.pools) {
            let pool = await getData(dbServer, `/read_db/readOne/SwimmingPools?Name=${p}`)
            pool = pool.data[0].Id
            poolsId.push(pool)
        }
        await postData(dbServer, '/create_db/createMany', {
            entity: 'PatientsPools', values: [poolsId.map(p => {
                return {
                    patientId: body.id
                    , poolId: p
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }
            })]
        })
        let treatmentLevelsId = []
        for (t of body.treatmentLevels) {
            let treatment = await getData(dbServer, `/read_db/readOne/Levels?Name=${t}`)
            treatment = treatment.data[0].Id
            treatmentLevelsId.push(treatment)
        }
        await postData(dbServer, '/create_db/createMany', {
            entity: 'PatientsTreatmentLevels', values: [treatmentLevelsId.map(t => {
                return {
                    patientId: body.id
                    , TreatmentLevelId: t
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }
            })]
        })
        await postData(dbServer, '/create_db/createMany', {
            entity: 'PatientUrgency', values: [body.urgencyNumbers.map(u => {
                return {
                    UrgencyNumber: u
                    , PatientId: body.id
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }
            })]
        })
    }
    return patient;
}

// work
async function findPatientById(id) {
    if (!body.id) {
        return false
    }
    try {
        const patient = await getData(dbServer, `/read_db/readOne/Patient?IdentityCard=${id}`)
        return patient
    }
    catch (error) {
        throw error
    }
}

// work
async function deleteById(body) {
    if (!body.id) {
        return false
    }
    try {
        const patient = findPatientById(body.id)
        // await getData(dbServer, `/read_db/readOne/Patient?IdentityCard=${body.id}`)
        if (patient.data) {
            try {
                const response = await postData(dbServer, '/delete_db/deleteOne', { entity: 'Patient', condition: { IdentityCard: body.id }, set: { DisabledDate: new Date(), DisableUser: body.disableUser } })
                return response
            } catch (error) {
                throw error
            }
        }
    }
    catch (error) {
        throw error
    }
}

// work for patient
async function update(body) {
    try {
        if (!body.set) {
            throw new error
        }
        const response = await postData(dbServer, '/update_db/updateMany', { entity: 'Patient', condition: body.condition, set: body.set })
        return response;
    }
    catch (error) {
        throw error
    }
}

// work
async function findPatientesByFeature(featureName, featureValue) {
    try {
        if (!featureName || !featureValue) {
            throw new error
        }
        const response = await postData(dbServer, '/read_db/readMany/Patient',
         { condition: { [featureName]: featureValue  } })
        return response
    }
    catch (error) {
        throw error
    }
}



async function updateRemarksArray(patientId, remark) {
    try {
        if (!patientId || !remark) {
            throw new error
        }
        const response = await postData(dbServer, '/crud_db/update', { entity: 'Patient', condition: { id: patientId }, update: { $push: { remarks: remark } } })
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
        patient = await postData(dbServer, '/crud_db/read', { entity: 'Patient', condition: { id: body.ID } })
    }
    catch (error) {
        return error;
    }
    if (patient.data) {
        const date = new Date().toISOString()
        const p = patient.data[0]
        try {
            await postData(dbServer, '/crud_db/insert', {
                entity: 'Patient',
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
            await postData(dbServer, '/crud_db/delete', { entity: 'Patient', condition: { id: body.ID } })
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
        const response = await postData(dbServer, '/read_db/readMany/Patient',
            { condition: { Disabled: 0, n: len } })
        if (indexStart > 0 && response.data.length > 0) {
            response.data = response.data.slice(indexStart)
        }
        // updateTreatmentPreference(response.data)
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
        patients = await postData(dbServer, '/read_db/readMany/Patient', { columns: '*', condition: { Disabled: 0 }, n: length })
        if (indexStart > 0 && patients.data.length > 0) {
            patients.data = patients.data.slice(indexStart)
        }
        // if (patients.data.length > 0) { sortByPreference(patients.data) }
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
        let patients
        length = parseInt(indexStart) + parseInt(length)
        patients = await postData(dbServer, '/read_db/readMany/Patient', { condition: { Disabled: 1, n: length } })
        if (indexStart > 0 && patients.data.length > 0) {
            patients.data = patients.data.slice(indexStart)
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

module.exports = { insertPatient, deleteById, updateRemarksArray, findPatientesByFeature, update, deletePatientById, getAllWaitingPatient, getAllDeletedOrEmbededPatient, getAllWaitingPatientOrderedByPreference }
