require('dotenv').config()
const axios = require('axios');
const { DB_SERVER_HOST, DB_SERVER_PORT } = process.env

const wlServer = axios.create({
    baseURL: `http://${DB_SERVER_HOST}:${DB_SERVER_PORT}/wl`
})

const rapidServer = axios.create({
    baseURL: `http://${DB_SERVER_HOST}:${DB_SERVER_PORT}/rp`
})

module.exports ={wlServer, rapidServer}