require('dotenv');
const axios = require('axios');
const { DB_SERVER_HOST, DB_SERVER_PORT } = process.env

const dbServer = axios.create({
    baseURL: `http://${DB_SERVER_HOST}:${DB_SERVER_PORT}`
})


const getData = async (server, url) => {
    let response;
    try {
        response = await server.get(url);
    }
    catch (error) {
        throw error;
    }
    return response;
}

const postData = async (server, url, body) => {
    let response;
    try {
        response = await server.post(url, body);
    }

    catch (error) {
        throw error;
    }
    return response;
}
module.exports = { dbServer, getData, postData }