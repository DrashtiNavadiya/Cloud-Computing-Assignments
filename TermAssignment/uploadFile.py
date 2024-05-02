import os
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        uid = event['uid']
        
        folder_key = f"{uid}/"
        
        response = s3.list_objects_v2(Bucket='b00948838', Prefix=folder_key)
        if 'Contents' not in response:
            s3.put_object(Bucket='ca-task', Key=folder_key)
        
        for file in event['files']:
            file_name = file['filename']
            file_content = file['content']
            
            s3.put_object(Bucket='b00948838', Key=f"{folder_key}{file_name}", Body=file_content)
        
        return {
            'statusCode': 200,
            'body': 'Files uploaded successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }
