import boto3

def lambda_handler(event, context):
    uid = event['uid']
    file_names = event['body']
    
    s3 = boto3.client('s3')
    
    bucket_name = 'b00948838'
    
    try:
        for file_name in file_names:
            key = f'{uid}/{file_name}'
            s3.delete_object(
                Bucket=bucket_name,
                Key=key
            )
        
        return {
            'statusCode': 200,
            'body': f"Files associated with UID '{uid}' deleted successfully"
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"Error: {str(e)}"
        }
