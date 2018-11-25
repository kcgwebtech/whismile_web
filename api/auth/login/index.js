const express = require('express');
const crypto = require('crypto');
const users = require('../../model/users');
const Token = require('../../token');
const router = express.Router();

router.post('/', (req, res) => {
    const user_id = req.body.user_id;
    const user_pw = req.body.user_pw;

    users.findOne({
        where: {
            user_id: user_id
        }
    }).then((user) => {
        if (!user) {
            throw '존재하지 않는 계정입니다!';
        }

        const hashPassword = crypto.createHash('md5').update(user_pw).digest('hex');

        if (user.user_pw !== hashPassword) {
            throw '잘못된 비밀번호입니다!';
        }

        const tokens = Token.getTokens(user_id);
        res.cookie('user', tokens);
        res.json(tokens);
    }).catch((err) => {
        res.json({
            error: {
                message: err
            }
        });
    });
});
module.exports = router;