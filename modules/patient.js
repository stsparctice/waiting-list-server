require('dotenv').config();
const { getData, postData } = require('../services/axios')
const {wlServer} = require('../services/servers')

// work for patient table
async function insertPatient(body) {
    try {
        const patient = await postData(wlServer, '/create/createOne', {
            entity: 'patient', values: [body]
        })
        return patient;
    } catch (error) {
        return error;
    }
}

async function insertRestDetailes(body) {
    if (!body.id)
        return 'no id'
    const patient = await findPatientById(body.id)
    if (patient.data.length > 0) {
        // Urgency =דחיפות
        const id = patient.data[0].Id

        if (body.teachers.length > 0) {
            let teachersId = []
            for (let t of body.teachers) {
                let teacher = await getData(wlServer, `/read/readOne/Teachers?TeacherName=${t.teacherName}`)
                teacher = teacher.data[0].Id
                teachersId.push({ teacherId: teacher, prefer: t.prefer })
            }
            _ = await postData(wlServer, '/create/createMany', {
                entity: 'PatientPreferenceTeachers', values: teachersId.map(t => ({
                    PatientId: id
                    , TeacherId: t.teacherId
                    , Preference: t.prefer
                    , AddedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }))
            })
        }
        if (body.comments.length > 0) {
            _ = await postData(wlServer, '/create/createMany', {
                entity: 'PatientsComment', values: body.comments.map(c => ({
                    patientId: id
                    , comment: c
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }))
            })
        }
        if (body.genders.length > 0) {
            let gendersId = []
            for (let g of body.genders) {
                let gender = await getData(wlServer, `/read/readOne/Genders?name='${g}'`)
                console.log(gender);
                gender = gender.data[0].Id
                gendersId.push(gender)
            }
            console.log(gendersId);
            await postData(wlServer, '/create/createMany', {
                entity: 'PatientsGenders', values: gendersId.map(g => ({
                    patientId: id
                    , genderId: g
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }))
            })
        }
        if (body.pools.length > 0) {
            let poolsId = []
            for (let p of body.pools) {
                let pool = await getData(wlServer, `/read/readOne/SwimmingPools?Name='${p}'`)
                pool = pool.data[0].Id
                poolsId.push(pool)
            }
            await postData(wlServer, '/create/createMany', {
                entity: 'PatientsPools', values: poolsId.map(p => ({
                    patientId: id
                    , poolId: p
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }))
            })
        }
        if (body.treatmentLevels.length > 0) {
            let treatmentLevelsId = []
            for (let t of body.treatmentLevels) {
                let treatment = await getData(wlServer, `/read/readOne/Levels?Name='${t}'`)
                treatment = treatment.data[0].Id
                treatmentLevelsId.push(treatment)
            }
            await postData(wlServer, '/create/createMany', {
                entity: 'PatientsTreatmentLevels', values: treatmentLevelsId.map(t => ({
                    patientId: id
                    , TreatmentLevelId: t
                    , addedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }))
            })
        }
        //(לא מאפשר null)disabledDate , DisabledUser:נדרש להכניס גם את  השדות  configכרגע לא עובד כיוון שב  
        if (body.urgencyNumbers.length > 0) {
            let urgencyNumbersId = []
            for (let u of body.urgencyNumbers) {
                switch (u) {
                    case "נמוכה": {
                        urgencyNumbersId.push(1)
                        break
                    }
                    case "בינונית": {
                        urgencyNumbersId.push(2)
                        break
                    }
                    case "גבוהה": {
                        urgencyNumbersId.push(3)
                        break
                    }
                }
            }
            await postData(wlServer, '/create/createMany', {
                entity: 'PatientUrgency', values: urgencyNumbersId.map(u => ({
                    UrgencyNumber: u
                    , PatientId: id
                    , AddedDate: new Date()
                    , UserName: body.userName
                    , Disabled: 0
                }))
            })
        }
        // 

        // PatientsPools יש בעיה בשליפת הנתונים מטבלת 
        //  SwimmingPools מטבלת join בגלל ה 

        if (body.preferenceDays.length > 0) {
            // let AllDays = []
            // let pools = await getData(wlServer, `/read/readMany/PatientsPools?patientId=${id}`)
            // console.log(pools);
            // for (let pool of pools.data) {
            //     let days = await postData(wlServer, '/read/readMany/PoolDaySchedule'
            //         , { condition: { SwimmingPoolId: 1 } })
            //     AllDays.push(...days.data)
            // }
            // console.log(AllDays);

            // let PreferenceDays = []
            // for (let p of body.preferenceDays) {
            //     let day = await gostData(wlServer, '/read/readOne/PoolDaySchedule'
            //         , { condition: { SwimmingPoolId, Day, GenderId, startHour, EndHour } })
            //     day = day.data[0]
            //     PreferenceDays.push(day)
            // }
            // await postData(wlServer, '/create/createMany', {
            //     entity: 'PatientPreferenceDays', values: PreferenceDays.map(d => ({
            //         PatientId: id
            //         , PoolDayScheduleId: d.Id
            //         , StartHour: d.StartHour
            //         , EndHour: d.EndHour
            //         , AddedDate: new Date()
            //         , UserName: body.userName
            //         , Disabled: 0
            //     }))
            // })
        }
    }
    return patient;
}

// work
async function findPatientById(id) {
    if (!id) {
        return false
    }
    try {
        const patient = await getData(wlServer, `/read/readOne/Patient?IdentityCard=${id}`)
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
        const patient = await findPatientById(body.id)
        // await getData(wlServer, `/read_db/readOne/Patient?IdentityCard=${body.id}`)
        if (patient.data) {
            try {
                const response = await postData(wlServer, '/delete/deleteOne', { entity: 'Patient', condition: { IdentityCard: body.id }, set: { DisabledDate: new Date(), DisableUser: body.disableUser } })
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
        const response = await postData(wlServer, '/update/updateMany', { entity: 'Patient', condition: body.condition, set: body.set })
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
        const response = await postData(wlServer, '/read/readMany/Patient',
            { condition: { [featureName]: featureValue } })
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
        const response = await postData(wlServer, '/crud/update', { entity: 'Patient', condition: { id: patientId }, update: { $push: { remarks: remark } } })
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
        patient = await postData(wlServer, '/crud/read', { entity: 'Patient', condition: { id: body.ID } })
    }
    catch (error) {
        return error;
    }
    if (patient.data) {
        const date = new Date().toISOString()
        const p = patient.data[0]
        try {
            await postData(wlServer, '/crud/insert', {
                entity: 'Patient',
                values: `'${p.id}','${p.name}','${body.status}','${date}','${p.medicalDocsDate}','${p.selectedGenders}','${p.treatmentLevel}','${p.treatmentPreference}' ,'${p.evaluated}','${p.evaluationDate}','${p.user}','${p.remarks}'`
            })
        }
        catch (error) {
            return error;
        }
        for (let i of p.swimmingPools) {
            try {
                await postData(wlServer, '/crud/insert', {
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
                await postData(wlServer, '/crud/insert', {
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
                await postData(wlServer, '/crud/insert', {
                    entity: 'patientDays',
                    values: `'${p.id}','${i.day}','${i.start}','${i.end}'`
                })
            }
            catch (error) {
                return error;
            }
        }
        try {
            await postData(wlServer, '/crud/delete', { entity: 'Patient', condition: { id: body.ID } })
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
        const response = await postData(wlServer, '/read/readMany/Patient',
            { condition: { Disabled: 0, n: { [indexStart]: len } } })
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
        patients = await postData(wlServer, '/read/readMany/Patient', { condition: { Disabled: 0, n: { [indexStart]: length } } })
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
        patients = await postData(wlServer, '/read/readMany/Patient', { condition: { Disabled: 1, n: { [indexStart]: length } } })
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

module.exports = { insertRestDetailes, insertPatient, deleteById, updateRemarksArray, findPatientesByFeature, update, deletePatientById, getAllWaitingPatient, getAllDeletedOrEmbededPatient, getAllWaitingPatientOrderedByPreference }
