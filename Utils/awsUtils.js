const AWS = require("aws-sdk");
exports.awsSearchByEmailParms = (email, tableName) => {
    return {
        TableName: tableName,
        KeyConditionExpression: "#Email = :email",
        ExpressionAttributeNames: {
            "#Email": "Email"
        },
        ExpressionAttributeValues: {
            ":email": email

        }
    };

};
exports.getAwsDoc =()=> {
    AWS.config.update({
        region: "eu-west-1",
        endpoint: "http://localhost:8000"
    });
    return new AWS.DynamoDB.DocumentClient();

};