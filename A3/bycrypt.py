import json
import requests
import hashlib

def lambda_handler(event, context):
    course_uri = event['course_uri']
    action = event['action']
    value = event['value']

    result = hashlib.md5(value.encode('utf-8')).hexdigest()
    
    Jbody = {
        "banner": "B00948838",
        "arn": "arn:aws:lambda:us-east-1:992382566420:function:MD5",
        "result": result,
        "value": value,
         "action": action,
    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(course_uri, json=Jbody, headers=headers)
    
    return {
        "message": "Success from MD5",
        'statusCode': 200,
        'body': Jbody
    }