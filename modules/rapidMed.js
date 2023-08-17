const { postData, getData } = require('../services/axios')
const { rapidServer } = require('../services/servers')

const patientType = {
    ID: 'id',
    NAME: 'name',
    FAMILY_NAME: 'familyName',
    PHONE: 'phone',
    WORK_PHONE: 'workPhone',
    CELL_PHONE: 'cellPhone',
    COMMENTS: 'comments',
    BIRTHDATE: 'birthdate',
    SEX: 'sex',
    KUPATHOLIM: 'kupatHolim'
}

const medProbType = {
    MED_PROB: 'medProb'
}

const priceListType = {
    NAME: 'name'
}



async function readDetails(id) {
    try {
        //     database: 'RapidMed',
        //     entity: `MedProbs as m`,
        //     secondTableName: `Patients p`,
        //     columns: `m.MedProb`,
        //     on: `m.PatID= p.PatID`,
        //     condition: `id='${id}'`
        // })

        let patient = await postData(rapidServer, '/read/readOne/patients', {
            condition: { id },
            entitiesFields: [
                {
                    entity: 'patients', fields: [
                        patientType.ID,
                        patientType.NAME,
                        patientType.FAMILY_NAME,
                        patientType.PHONE,
                        patientType.WORK_PHONE,
                        patientType.CELL_PHONE,
                        patientType.COMMENTS,
                        patientType.BIRTHDATE,
                        patientType.SEX, 
                        patientType.KUPATHOLIM]
                },
                { entity: 'medProbs', fields: [medProbType.MED_PROB] },
                { entity: 'priceLists', fields: [priceListType.NAME] }
            ]
        })
        const { data } = patient
        console.log({ data })
        const { birthdate } = data[0]
        console.log(birthdate)
        const ans = checkDate(birthdate)
        console.log({ ans })

        ans.data[0].medProb = medProb.data.MedProb
        ans.data[0].priceList = priceList.data.Name
        // console.log('ans', ans.data);
        if (ans.data[0].Name && ans.data[0][patientType.FAMILY_NAME] && ans.data[0].Birthdate != 'no date')
            return ans.data[0]
        return { error: 'one or more details are missing' }
    }
    catch (error) {
        throw new Error('didnt get a matching details')
    }
}

function checkDate(dateString) {
    //לא טיפלתי אם יש תאריך באורך 7 
    //1232000 כמו: 5112000
    let date
    if (dateString.indexOf('/') > 0) {
        if (dateString.length === 8)
            date = new Date(dateString.slice(4, 8) + '-0' + dateString.slice(2, 3) + '-0' + dateString.slice(0, 1))
        else
            date = new Date(dateString.slice(6, 10) + '-' + dateString.slice(3, 5) + '-' + dateString.slice(0, 2))
    }
    else {
        if (dateString.length === 8)
            date = new Date(dateString.slice(4, 8) + '-' + dateString.slice(2, 4) + '-' + dateString.slice(0, 2))
        if (dateString.length === 6)
            date = new Date(dateString.slice(2, 6) + '-0' + dateString.slice(1, 2) + '-0' + dateString.slice(0, 1))
    }
    if (dateString === '' || dateString == 'null' || date === 'Invalid Date') {
        return 'no date'
    }
    if (dateString.length === 8) {
        if (date.getDate() !== parseInt(dateString.slice(0, 2)))
            return 'no date'
    }
    if (dateString.length === 6) {
        if (date.getDate() !== parseInt(dateString.slice(0, 1)))
            return 'no date'
    }
    console.log({ date })
    return date
}

module.exports = { readDetails }
