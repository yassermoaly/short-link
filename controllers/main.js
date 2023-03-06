const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const express = require('express');
const router = express.Router();
const httpRequest = require('request');
const db = require('../models/index')
const jwt = require('jsonwebtoken');

var validateToken = function (token, callBack) {
    jwt.verify(token, config.JWT_SECRET_KEY, function (err, decoded) {
        if (err)
            callBack(null);
        callBack(decoded);
    });
}

router.get('/:id(\\d+)/', (req, res) => {
    var sysDate = new Date();
    db.links.findByPk(req.params.id).then(record => {
        record.update({
            isVisited: true,
            visitedAt: sysDate,
        });
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
                isAdmin: records[0].isAdmin,
                userId: records[0].id,
                expiresIn: '5d'
            }
            const token = jwt.sign(data, jwtSecretKey);

            res.send({ 'status': 'success', 'token': token,user : data });
        }
        else {
            res.send({ 'status': 'invalid-login' });
        }
    });
});

router.post('/create', (req, res) => {
    validateToken(req.headers.authorization, function (claims) {
        if (claims) {
            var sysDate = new Date();
            const hostFullUrl = `${req.protocol}://${req.headers.host}`;
            var newRecord = {
                link: req.body.link,
                createdAt: sysDate,
                createdBy : claims.userId,
                isVisited : false
            }
            db.links.create(newRecord).then(newRecord => {
                res.send({ 'url': `${hostFullUrl}/${newRecord.id}` });
            });
        }
        else
            res.status(401).json({ errors: "Invalid Login" });
    })
});

router.get('/users/getAll', (req, res) => {

    validateToken(req.headers.authorization, function (claims) {
        if (claims && claims.isAdmin) {
            db.users.findAll({
                where: {
                    isActive: true,
                }
            }).then(records => {
                res.send(records);
            });
        }
        else
            res.status(401).json({ errors: "Invalid Login" });
    });    
});

router.post('/users/save', (req, res) => {
    validateToken(req.headers.authorization, function (claims) {
        if (claims && claims.isAdmin) {
            var sysDate = new Date();
        db.users.findAll({
            where: {
                username: req.body.username,
                isActive: true
            }
        }).then(dbRecords => {

            if (dbRecords.length > 0) {
                var dbRecord = dbRecords[0]
                dbRecord.update({
                    password: req.body.password,
                    isAdmin: req.body.isAdmin,
                    isActive: req.body.isActive
                }).then(function (savedRecord) {
                    res.send(savedRecord);
                });
            }
            else {
                var dbRecord = {
                    username: req.body.username,
                    password: req.body.password,
                    isAdmin: req.body.isAdmin,
                    isActive: true,
                    createdAt: sysDate
                };
                db.users.create(dbRecord).then(savedRecord => {
                    res.send(savedRecord);
                });
            }
        });
        }
        else
            res.status(401).json({ errors: "Invalid Login" });
    });   
});

module.exports = router;