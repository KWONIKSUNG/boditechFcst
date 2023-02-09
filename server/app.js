const express = require('express');
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const loginRouter = require('./routes/login');
const excelRouter = require('./routes/excel');
const logoutRouter = require('./routes/logout');
const userIdRouter = require('./routes/userId');
const allExcelRouter = require('./routes/allExcel');
const getUserRouter = require('./routes/getUser');
const currentDataRouter = require('./routes/currentExcel');
const adminGet = require('./routes/adminGet');
const filterUserRouter = require('./routes/filterUser');


const app = express();
app.set('port', 80);

app.use(express.json({ limit: '100mb' }));
app.use(serveStatic(path.join(__dirname, '../client/build')));
app.use(cookieParser());
app.use(expressSession({
    secret: 'key',
    resave: true,
    saveUninitialized: true
}));
app.use(cors());

app.use('/api/excel', excelRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/userId', userIdRouter);
app.use('/api/allExcel', allExcelRouter);
app.use('/api/getUser', getUserRouter)
app.use('/api/currentdata', currentDataRouter);
app.use('/api/adminGet', adminGet);
app.use('/api/filterUser', filterUserRouter);

app.listen(80, function () {
    console.info('listening on 80')
})
