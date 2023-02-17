const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.info('logout 진행중')
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        console.info('세션 삭제 중 에러 발생');
        return;
      }
      console.info('로그아웃 완료.');
      res.json('로그아웃 완료');
    })
  } else {
    res.json('유저 정보가 없습니다.');
  }
})

module.exports = router;