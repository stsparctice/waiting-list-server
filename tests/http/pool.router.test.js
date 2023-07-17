const request = require('supertest')
const { app } = require('../../app')
jest.mock('../../modules/pool', () => {
    return {
        add: jest.fn((obj=null) => {
            return "123456"
        }),
        update: jest.fn((obj) => {
          
            return "successUpdate"
        }),
        find: jest.fn((obj) => {
            if (obj === undefined)
                return {res:'not found'}

            return {name:'happy',color:'blue',adress:'ashdod'}
        }),
        getAll: jest.fn((obj) => {
            return [{ name: "dvory" }, { family: "traube" }]
        })
    }
})

describe('add',()=>{
    it('should return the inserted id',async()=>{
        let res=await request(app).post('/pool/add',{name:'happy',color:'green'})
        expect(res).toBeDefined()
        expect(res.text).toBe("123456")
        expect(res.statusCode).toBe(200)
    })
})
describe('update',()=>{
    it('should return if it update',async()=>{
        let res=await request(app).post('/pool/update',{name:'happy'})
        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe("successUpdate")
      
    })
})
describe('find',()=>{
    it('should return the inserted id',async()=>{
        let res=await request(app).post('/pool/find',{name:'happy'})
        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)
        // expect(res.text).toBe('not found')
        
    })
})
describe('getAll',()=>{
    it('should return the inserted id',async()=>{
        let res=await request(app).post('/pool/getAll',{})
        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)
    })
})
describe('delete',()=>{
    it('should return the inserted id',async()=>{
        let res=await request(app).post('/pool/delete',{})
        expect(res).toBeDefined()
        // expect(res.statusCode).toBe(200)
        
    })
})
