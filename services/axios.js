require('dotenv');




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
module.exports = {  getData, postData }