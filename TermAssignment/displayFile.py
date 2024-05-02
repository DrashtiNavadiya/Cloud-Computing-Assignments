import boto3

def lambda_handler(event, context):
    uid = event['uid']
    print(uid)
    s3 = boto3.client('s3')
    
    bucket_name = 'b00948838'
    
    prefix = f'{uid}/'
    
    
    try:
        response = s3.list_objects_v2(
            Bucket=bucket_name,
            Prefix=prefix
        )
        
        files = [obj['Key'].split('/')[-1] for obj in response.get('Contents', [])]
        
        return {
            'statusCode': 200,
            'body': files
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"Error: {str(e)}"
        }
