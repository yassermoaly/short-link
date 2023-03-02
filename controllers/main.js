const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const express = require('express');
const router = express.Router();
const httpRequest = require('request');
const db = require('../models/index')
const jwt = require('jsonwebtoken');

var validateToken = function (token) {
    return jwt.verify(token, config.JWT_SECRET_KEY);
}

router.get('/go/:id', (req, res) => {
    db.links.findByPk(req.params.id).then(record => {
        res.redirect(record.link);
    });
});
router.get('/', (req, res) => {
    res.writeHead(302, {
        'Location': 'https://www.hiiauto.com'
    });
    res.end();
});

router.post('/auth/generateToken', (req, res) => {
    db.users.findAll({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    }).then(records => {
        if (records.length == 1) {
            let jwtSecretKey = config.JWT_SECRET_KEY;
            let data = {
                time: Date(),
                userId: records[0].id,
                expiresIn: '5d'
            }
            const token = jwt.sign(data, jwtSecretKey);

            res.send({ 'status': 'success', 'token': token });
        }
        else {
            res.send({ 'status': 'invalid-login' });
        }
    });
});

router.post('/create', (req, res) => {
    console.log("start...");
    console.log(req.headers.authorization);
    if (validateToken(req.headers.authorization)) {
        var sysDate = new Date();
        const hostFullUrl = `${req.protocol}://${req.headers.host}`;
        var newRecord = {
            link: req.body.link,
            createdAt: sysDate
        }
        db.links.create(newRecord).then(newRecord => {
            res.send({ 'url': `${hostFullUrl}/go/${newRecord.id}` });
        });
        // console.log(req.body.link);
        // db.links.findAll({
        //     where: {
        //         link: req.body.link,
        //     }
        // }).then(records => {
        //     if (records.length > 0) {
        //         res.send({ 'url': `${hostFullUrl}/${records[0].id}` });
        //     }
        //     else {
        //         var newRecord = {
        //             link: req.body.link,
        //             createdAt: sysDate
        //         }
        //         db.links.create(newRecord).then(newRecord => {
        //             res.send({ 'url': `${hostFullUrl}/go/${newRecord.id}` });
        //         });
        //     }
        // });
    }
    else
        res.status(401).json({ errors: "Invalid Login" });
});

module.exports = router;