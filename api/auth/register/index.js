const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const users = require('../../model/users');

router.post('/', (req, res) => {
    const user_id = req.body.user_id;
    const user_pw = req.body.user_pw;

    if (!(user_id && user_pw)) {
        res.json({
            error: {
                message: '올바른 ID 또는 PW가 아닙니다.',
            }
        });

        return;
    }

    const hashPassword = crypto.createHash('md5').update(user_pw).digest('hex');

    users.findOrCreate({
        where: {
            user_id: user_id
        },
        defaults: {
            user_id: user_id,
            user_pw: hashPassword
        }
    }).spread((user, created) => {
        if (created) {
            res.json({
                data: {
                    message: '성공적으로 가입되었습니다!'
                }
            })
        } else {
            res.json({
                error: {
                    message: '이미 존재하는 계정입니다!'
                }
            });
        }
    });
});

module.exports = router;