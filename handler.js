const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "UsersTable";

module.exports.main = async (event) => {

  // POST → create user
  if (event.requestContext.http.method === "POST") {
    const body = JSON.parse(event.body);

    const item = {
      userId: uuidv4(),
      name: body.name,
      email: body.email,
    };

    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: item,
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created",
        data: item,
      }),
    };
  }

  // GET → fetch all users
  if (event.requestContext.http.method === "GET") {
    const result = await dynamodb.scan({
      TableName: TABLE_NAME,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  }

  // fallback
  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Unsupported method" }),
  };
};
