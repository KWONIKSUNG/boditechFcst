const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

router.post('/', async (req, res) => {
    const userId = req.body.data.id;
    const userPw = req.body.data.password;
    if (userId === undefined) return res.json('등록되지 않은 유저 입니다.');
    if (userId === 'admin') {
        if (userPw === process.env.ADMIN_INFO) {
            return res.json('success');
        } else {
            return res.json('invaild id or password')
        }

    }
    connection.query(`
        select userId, userPw from ${LOGIN_SHEET} where userId = '${userId}';
    `, (error, rows, fields) => {
        if (error || rows.length === 0) {
            return res.json('invaild user');
        }
        let id = rows[0].userId;
        if (id && userPw === rows[0].userPw) {
            req.session.user = {
                id: userId,
                pw: userPw,
                name: userId,
                authorized: true,
            };
            res.json('success');
        } else {
            res.json('invaild user');
        }

    })
})


module.exports = router;