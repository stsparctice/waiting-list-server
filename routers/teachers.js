const express = require('express')
const router = express.Router()
const { deleteTeacher, insertTeacher, findTeacher, updateTeacher, findDisabledTeachers } = require('../modules/teachers')


// insert  //
router.post('/insertTeacher', express.json(), async (req, res) => {
    const ans = await insertTeacher(req.body)
    res.send(ans)
})

//delete//
router.post('/deleteTeacher', express.json(), async (req, res) => {
    const ans = await deleteTeacher(req.body);
    res.send(ans)
})


// read //
router.get('/findTeacher', async (req, res) => {
    
    const ans = await findTeacher(req.query)
    if (ans)
        res.status(200).send(ans)
    else
        res.status(404).send('dont find teacher for your ')

})
router.post('/findTeacherByFilter',express.json(),async(req,res)=>{
    
const ans = await findTeacher({$or:req.body.filter})
res.send(ans)
})




//update //
router.post('/updateTeacher', express.json(), async (req, res) => {
  
    const ans = await updateTeacher({ name: req.body.name }, req.body.update)
    if (ans)
        res.status(200).send(ans)

})


//read from sql//
router.get('/findDisabledTeachers', async (req, res) => {
    const ans = await findDisabledTeachers()
        res.status(200).send(ans)

})

module.exports = router


