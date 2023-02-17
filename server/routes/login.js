const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

router.post('/', async (req, res) => {
    const userId = req.query.id;
    const userPw = req.query.password;
    if (userId === undefined) return res.json('등록되지 않은 유저 입니다.');
    if (userId === 'admin') {
        if (userPw === process.env.ADMIN_INFO) {
            return res.json('is admin');
        } else {
            return res.json('invaild id or password')
        }

    }
    connection.query(`
        select USERID, USERPW,agency from ${LOGIN_SHEET} where USERID = '${userId}';
    `, (error, rows, fields) => {
        const { USERID, USERPW, agency } = rows[0]
        if (error || rows.length === 0) {
            return res.json('invaild user');
        }
        let id = rows[0].USERID;
        if (id && userPw === rows[0].USERPW) {
            req.session.user = {
                id: userId,
                pw: userPw,
                name: userId,
                authorized: true,
            };
            res.json({ id: USERID, pw: USERPW, agency: agency })
        } else {
            res.json('invaild user');
        }

    })
})


module.exports = router;