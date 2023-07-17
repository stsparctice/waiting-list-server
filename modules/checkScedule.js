
//הפונקציה מקבלת מערך של אוביקטים כאשר כל אוביקט מכי שעת התחלה ושעת סיום וכן מקבלת אוביקט המכיל שעת התחלה
//ושעת סיום ובודקת האם ניתן להכניס את האוביקט החדש למערך השעות כלומר האם השעות הרצויות להוספה פנויות במערכת השעות ומחזירה בהתאם
const available = (arrOfObjHours, current) => {

    for (let item of arrOfObjHours) {
        if (!item.start || !item.end || !current.start || !current.end) {
            throw new Error("one of arguments dosent have an attribute start/end")
        }
        else {
            if (
                (current.start >= item.start && current.start < item.end)
                ||
                (current.end > item.start && current.end <= item.end)
                ||
                ((item.start >= current.start && item.start <= current.end) &&
                    (item.end >= current.start && item.end <= current.end))
            )
                return false
        }
        return true
    }

}



//הפונקציה מקבלת מערך של אוביקטים כאשר כל אוביקט מכיל שעת התחלה ושעת סיום וכן מקבלת אוביקט המכיל שעת התחלה
//ושעת סיום ובודקת האם השעה הרצויה נמצאת בשעות הפעילות במערכת השעות ומחזירה בהתאם
const isActive = (arrOfObjHours, current) => {

    for (let item of arrOfObjHours) {
        if (!item.start || !item.end || !current.start || !current.end) {
            throw new Error("one of arguments dosent have an attribute start/end")
        }
        else {
            if (current.start >= item.start && current.end <= item.end)
                return true
        }
        return false
    }
}

//הפונקציה מקבלת מערך של אוביקטים כאשר כל אוביקט מכיל שעת התחלה ושעת סיום
// הפונקציה מחזירה את מערך האוביקטים ממוינים בסדר עולה לפי שעת התחלה
const sortSchedule = (obj) => {
    let temp
    for (let i = 0; i < obj.length - 1; i++) {
        for (let j = 0; j < obj.length - i - 1; j++) {
            if (obj[j].startActiveHour > obj[j + 1].startActiveHour) {
                temp = obj[j]
                obj[j] = obj[j + 1]
                obj[j + 1] = temp
            }
        }
    }
    return obj
}

module.exports = { available, isActive, sortSchedule }

