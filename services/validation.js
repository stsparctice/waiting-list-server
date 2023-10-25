
const checkObj = (type, obj) => {
    let flag = false;
    let missingValues = []
    for (let key in type) {
        if (type[key].required == true) {
            for (let key2 in obj) {
                if (type[key].name.toLocaleLowerCase() == key2.toLocaleLowerCase()) {
                    flag = true;
                }
            }
            if (flag == false) {
                missingValues.push(type[key].name)
            }
            flag = false
        }
    }
    if (missingValues.length > 0) {
        throw new Error(`The missing values are:${missingValues}`)
    }
}
module.exports = { checkObj }