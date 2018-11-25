const jwt = require('jsonwebtoken');
const jwtConfig = require('./config/jwt');

class Token {
    static getTokens(userId) {
        const payload = {
            user_id: userId,
        };

        const token = jwt.sign(
            payload,
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.tokenExpire,
            });

        const refreshToken = jwt.sign(
            payload,
            jwtConfig.refreshSecret,
            {
                expiresIn: jwtConfig.refreshTokenExpire,
            });


        return { token, refreshToken };
    }

    static validateToken(token, secretKey) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err && err.name !== 'TokenExpiredError') {
                    reject(err);
                } else if (err) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    static checkToken(req, res, next) {
        if (req.originalUrl.match(/^\/auth/)) {
            return next();
        }

        console.log('@checkToken', req.originalUrl);

        const tokens = req.cookies.user;

        if (!tokens) {
            return res.json({
                error: {
                    name: 'UserLogout',
                    message: '로그인해주세요.'
                }
            });
        }

        const accessToken = tokens.token;
        const refreshToken = tokens.refreshToken;
        const userId = req.body.user_id || req.query.user_id;

        Token.validateToken(accessToken, jwtConfig.secret)
            .then((isExpired) => {
                if (isExpired) {
                    console.log('@refreshToken', req.originalUrl);

                    return Token.validateToken(refreshToken, jwtConfig.refreshSecret);
                } else {
                    next();
                }
            })
            .then((isExpired) => {
                if (isExpired) {
                    throw {
                        name: 'RefreshTokenExpired',
                        message: '다시 로그인해주세요'
                    };
                } else {
                    return Token.getTokens(userId);
                }
            })
            .then((tokens) => {
                res.cookie('user', tokens);
                next();
            })
            .catch((err) => {
                res.json({
                    error: {
                        name: err.name,
                        message: err.message
                    }
                });
            });
    }
}

module.exports = Token;