const AWS = require("aws-sdk");
const parser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;



exports.userLogin = (req, res, next) => {



    var jwt = require('jsonwebtoken');
    var token = jwt.sign({
        foo: 'bar'
    }, 'shhhhh');
    res.status(200).json({
        'status': "success",
        'token': token
    });



};

exports.createUser = (req, res, next) => {
    var email = req.body.email;
    var pwd = encryptPwd(req.body.password);


    AWS.config.update({
        region: "eu-west-1",
        endpoint: "http://localhost:8000"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "users",
        Item: {
            "Email": email,
            "Password": pwd
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            res.status(500).json({
                "status": "failed"
            });
        } else {
            res.status(200).json({
                "status": "success",
                "newUserEmail": email
            });
        }
    });

};

function encryptPwd(password) {
    return bcrypt.hashSync(password, saltRounds);
}