require('dotenv');




const getData = async (server, url, query) => {
    let response;
    try {
        if(query){
            url+=`?${buildQueryFromCondition(query)}`
        }
        response = await server.get(url);
    }
    catch (error) {
        throw error;
    }
    return response;
}

const postData = async (server, url, body) => {
    console.log({body, url})
    try {
       let response = await server.post(url, body);
       console.log({response})
        return response;
    }

    catch (error) {
        throw error;
    }
}

const buildQueryFromCondition = (query)=>{
    const entries = Object.entries(query)
    const queryArray = entries.reduce((q, ent)=>q=[...q,`${ent[0]}=${ent[1]}`], [])
    const queryString = queryArray.join('&')
    return queryString
}

module.exports = {  getData, postData }