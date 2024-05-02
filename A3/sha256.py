import json
import requests
from hashlib import sha256

def lambda_handler(event, context):
    course_uri = event['course_uri']
    value = event['value']
    action = event['action']
   
    result = sha256(value.encode('utf-8')).hexdigest()
    
    Jbody = {
        "banner": "B00948838",
        "arn": "arn:aws:lambda:us-east-1:992382566420:function:SHA256",
        "result": result,
        "value": value,
         "action": action,
    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(course_uri, json=Jbody, headers=headers)
    
    return {
        "message": "Success from SHA256",
        'statusCode': 200,
        'body': Jbody
    }