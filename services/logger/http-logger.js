const httpLogger = ()=>{
    return (req, res, next)=>{
        const {url, query, params, body, method} = req
        console.log({url, query, params, body, method})
        next()
    }
}


module.exports = {httpLogger}