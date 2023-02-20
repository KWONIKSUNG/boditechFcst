const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

router.post('/', async (req, res) => {
    const userId = req.query.id;
    const userPw = req.query.password;

    connection.query(`
        select USERID, USERPW,agency from ${LOGIN_SHEET} where USERID = '${userId}';
    `, (error, rows, fields) => {
        const { USERID, USERPW, agency } = rows[0]
        if (error || rows.length === 0) {
            throw new Error('error')
        }
        if (USERID && userPw === USERPW) {
            req.session.user = {
                id: userId,
                pw: userPw,
                name: userId,
                authorized: true,
            };
            res.json({ id: USERID, pw: USERPW, agency: agency })
        } else {
            throw new Error('error');
        }

    })
})


module.exports = router;