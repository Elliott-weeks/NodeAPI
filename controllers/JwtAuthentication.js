const fs = require('fs');
const jwt = require('jsonwebtoken');
const auth = require('../Utils/awsUtils');
const AWS = require("aws-sdk");
const tableName = "Users_Table";
exports.checkToken =(req,res,next)=>{
    var token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided' });
    token = token.split(" ");
    if(token.length !== 2|| token[1] === undefined) return res.status(400).send({ auth: false, message: 'bad token format' });
    jwt.verify(token[1], fs.readFileSync('public.key'), {
        algorithms: ['RS256']
    }, function (err, decoded) {
        if(err && err.name ==="JsonWebTokenError" ) return res.status(403).send({ auth: false, message: "invalid token" });
        if(err && err.name ==="TokenExpiredError") return res.status(403).send({ auth: false, message: "token expired"});
        if(decoded){
            AWS.config.update({
                region: "eu-west-1",
                endpoint: "http://localhost:8000"
              });
            var docClient = new AWS.DynamoDB.DocumentClient();
            docClient.query(auth.awsSearchByEmailParms(decoded.identity,tableName),(err,data)=>{
                if(err) return res.status(403).send({ auth: false, message: "unable to validate token"});
                if(data.Items.length ===1) next();

            });
          
        }
    });
   


    
    
    
};