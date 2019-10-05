const AWS = require("aws-sdk");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const tableName = "Users_Table";
const fs = require('fs');
const awsUtil = require('../Utils/awsUtils');

exports.userLogin = (req, res, next) => {
    var jwt = require('jsonwebtoken');
    var docClient = awsUtil.getAwsDoc();
    if (!req.body.hasOwnProperty('email') && !req.body.hasOwnProperty('password')) {
        res.status(400).json({
            "status": "Failed",
            "error": "bad request should include keys email and password"
        });
    } else {


        var email = req.body.email;
        var password = req.body.password;

        docClient.query(awsUtil.awsSearchByEmailParms(email,tableName), (err, data) => {
            if (err) {
                res.status(503).json({
                    "status": "Failed",
                    "error": err
                });
            } else if (data.Items.length === 1 && bcrypt.compareSync(password, data.Items[0].Password)) {
                var payload = {
                    "identity": email
                };
                var key = fs.readFileSync('private.key');
                var token = jwt.sign(payload, key, {
                    algorithm: 'RS256',
                    expiresIn: '1s'
                });

                res.status(200).json({
                    "status": "success",
                    "jwt": token
                });


            } else {
                res.status(200).json({
                    "status": "Failed",
                    "jwt": null
                });

            }



        });
    }




};

exports.createUser = (req, res, next) => {
    var docClient = awsUtil.getAwsDoc();

    if (!req.body.hasOwnProperty('email') && !req.body.hasOwnProperty('password')) {
        res.status(400).json({
            "status": "Failed",
            "error": "bad request should include keys email and password"
        });
    } else {
        var email = req.body.email;
        var pwd = encryptPwd(req.body.password);

        docClient.query(awsUtil.awsSearchByEmailParms(email, tableName), (err, data) => {
            if (err) {
                console.log(err);
                res.status(503).json({
                    "status": "Failed",
                    "error": err
                });
            } else if (data.Items.length !== 0) {
                res.status(200).json({
                    "status": "user already exists",
                    "newUserEmail": email
                });

            } else {
                var params = {
                    TableName: tableName,
                    Item: {
                        "Email": email,
                        "Password": pwd
                    }
                };
                docClient.put(params, function (err, data) {
                    if (err) {
                        res.status(500).json({
                            "status": "Failed",
                            "error": err
                        });
                    } else {
                        res.status(200).json({
                            "status": "success",
                            "newUserEmail": email
                        });
                    }
                });

            }

        });
    }

};

function encryptPwd(password) {
    return bcrypt.hashSync(password, saltRounds);
}
