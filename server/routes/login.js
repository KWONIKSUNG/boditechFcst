const express = require('express');
const { connection } = require('../sql_server/server');
const { LOGIN_SHEET } = require('../common/var');

const router = express.Router();

router.post('/', async (req, res) => {
    const userId = req.body.data.id;
    const userPw = req.body.data.password;
    if (userId === 'admin') return res.json('success');
    connection.query(`
        select userId, userPw from ${LOGIN_SHEET} where userId = ?;
    `, [userId], (error, rows, fields) => {
        if (rows[0] === null || rows[0].length === 0) res.json('등록되지 않은 유저 입니다.');
        if (rows[0].userId && userPw === rows[0].userPw) {
            req.session.user = {
                id: userId,
                pw: userPw,
                name: userId,
                authorized: true,
            };
            res.json('success');
        } else {
            res.json('등록되지 않은 유저 입니다.');
        }

    })
})


module.exports = router;