const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const patientsSwagger = require('./swagger/patient.json');
const poolSwagger = require('./swagger/pool.json')
const scheduleSwagger = require('./swagger/schedule.json')
const teacherSwagger = require('./swagger/teacher.json');
const genderSwagger = require('./swagger/gender.json');
const patientRouter = require('./routers/patient')
const poolRouter = require('./routers/pool')
const genderRouter = require('./routers/gender')
const scheduleRouter = require('./routers/schedule')
const teacherScheduleRouter = require('./routers/teacherSchedule')
const teachersRouter = require('./routers/teachers')
const rapidMedRouter = require('./routers/rapidMed')



var options = {}
app.use(cors());

app.use('/api-docs-teachers', swaggerUi.serveFiles(teacherSwagger, options), swaggerUi.setup(teacherSwagger))
app.use('/api-docs-pool', swaggerUi.serveFiles(poolSwagger, options), swaggerUi.setup(poolSwagger));
app.use('/api-docs-schedule', swaggerUi.serveFiles(scheduleSwagger, options), swaggerUi.setup(scheduleSwagger));
app.use('/api-docs-gender', swaggerUi.serveFiles(genderSwagger, options), swaggerUi.setup(genderSwagger))
app.use('/api-docs-patients', swaggerUi.serveFiles(patientsSwagger, options), swaggerUi.setup(patientsSwagger));

app.use('/api-docs-dynamic', function (req, res, next) {
  req.swaggerDoc = swaggerDocument;
  next();
}, swaggerUi.serveFiles(), swaggerUi.setup());

app.use('/pool', poolRouter)
app.use('/patient', patientRouter);
app.use('/gender', genderRouter)
app.use('/rapidMed', rapidMedRouter)
app.use('/teacher_schedule', teacherScheduleRouter)
app.use('/teachers', teachersRouter)
app.use('/schedule', scheduleRouter)

app.set('view engine', 'ejs')

module.exports = { app };
