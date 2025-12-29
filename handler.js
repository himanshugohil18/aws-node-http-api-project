import json
import boto3
import uuid

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("UsersTable")

def main(event, context):

    # POST → create user
    if event["requestContext"]["http"]["method"] == "POST":
        body = json.loads(event["body"])

        user_id = str(uuid.uuid4())

        item = {
            "userId": user_id,
            "name": body["name"],
            "email": body["email"]
        }

        table.put_item(Item=item)

        return {
            "statusCode": 201,
            "body": json.dumps({
                "message": "User created",
                "data": item
            })
        }

    # GET → fetch all users
    if event["requestContext"]["http"]["method"] == "GET":
        response = table.scan()

        return {
            "statusCode": 200,
            "body": json.dumps(response["Items"])
        }
