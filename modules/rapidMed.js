const { dbServer, postData } = require('../services/axios')

async function readDetails(id) {
    try {
        let ans = await postData(dbServer, '/crud_db/read', {
            entity: 'patients',
            columns:
                `[ID]
            ,[Name]
            ,[Family Name]
            ,[Phone]
            ,[Work Phone]
            ,[Cell Phone]
            ,[Comments]
            ,[Birthdate]
            ,[Sex]
            ,[KupatHolim]`,
            condition: `ID='${id}'`
        })
        ans.data.Birthdate = checkDate(ans.data.Birthdate)

        let medProb = await postData(dbServer, '/crud_db/read', {
            database: 'RapidMed',
            entity: `MedProbs as m`,
            secondTableName: `Patients p`,
            columns: `m.MedProb`,
            on: `m.PatID= p.PatID`,
            condition: `id='${id}'`
        })

        let priceList = await postData(dbServer, '/crud_db/read', {
            database: 'RapidMed',
            entity: `PriceLists pl`,
            secondTableName: `Patients p`,
            columns: `pl.Name`,
            on: `pl.Number =p.PriceList`,
            condition: `id='${id}'`
        })
        
        ans.data.medProb = medProb.data.MedProb
        ans.data.priceList = priceList.data.Name
        console.log('ans', ans.data);
        if (ans.data.Name && ans.data['Family Name'] && ans.data.Birthdate != 'no date')
            return ans.data
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
    return date
}

module.exports = { readDetails }
