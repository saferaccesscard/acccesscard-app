import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || '';

export const handler = async (event: any) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    try {
        // Basic validation (Assuming API Gateway passes parsed body or direct invoke)
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

        if (!body.studentId || !body.name || !body.institutionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: studentId, name, institutionId' }),
            };
        }

        const studentId = body.studentId;
        const item = {
            studentId: studentId,
            institutionId: body.institutionId,
            name: body.name,
            photoUrl: body.photoUrl || null,
            status: 'ACTIVE',
            grade: body.grade || null,
            parentIds: body.parentIds || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: item,
            ConditionExpression: 'attribute_not_exists(studentId)', // Prevent overwrite logic if needed
        });

        await docClient.send(command);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Student created successfully', studentId }),
        };
    } catch (error: any) {
        console.error('Error creating student:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};
