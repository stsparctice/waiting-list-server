const request = require('supertest')
const {app}=require('../../app')
let server

beforeAll(()=>{
    server=app.listen(4332)
})

describe('GET APIs',()=>{
    it(' / path returns not found message', async () => {
        const response = await request(app).get('/hello')
        expect(response.notFound).toBeTruthy()
        expect(response.statusCode).toBe(404)
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8')
        // expect(response.text).toBe('not found')
    })

    
})

afterAll(()=>{
    server.close()
})
