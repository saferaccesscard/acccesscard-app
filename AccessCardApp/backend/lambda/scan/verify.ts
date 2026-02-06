import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const STUDENTS_TABLE = process.env.STUDENTS_TABLE || '';
const LOGS_TABLE = process.env.LOGS_TABLE || '';

export const handler = async (event: any) => {
    console.log('Scan Event:', JSON.stringify(event));

    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { qrPayload, gateId, scannerId } = body;

        // TODO: Verify signature of qrPayload (JWT verification)
        // For now, assuming qrPayload IS the studentId for simplicity in initialization
        const studentId = qrPayload;

        if (!studentId) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Invalid payload' }) };
        }

        // 1. Check Student Status
        const getCommand = new GetCommand({
            TableName: STUDENTS_TABLE,
            Key: { studentId },
        });

        const { Item: student } = await docClient.send(getCommand);

        if (!student) {
            return { statusCode: 404, body: JSON.stringify({ status: 'DENIED', reason: 'Student not found' }) };
        }

        if (student.status !== 'ACTIVE') {
            await logAttempt(studentId, 'DENIED', 'Student Suspended', gateId);
            return { statusCode: 403, body: JSON.stringify({ status: 'DENIED', reason: 'Card Suspended' }) };
        }

        // 2. Log Entry
        await logAttempt(studentId, 'ENTRY', 'Success', gateId);

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'ALLOWED',
                student: { name: student.name, photoUrl: student.photoUrl, grade: student.grade }
            }),
        };

    } catch (error: any) {
        console.error('Scan Error:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Error' }) };
    }
};

async function logAttempt(studentId: string, action: string, reason: string, gateId: string) {
    const timestamp = new Date().toISOString();
    const command = new PutCommand({
        TableName: LOGS_TABLE,
        Item: {
            pk: `LOG#${timestamp}`,
            sk: `STUDENT#${studentId}`,
            studentId,
            action,
            reason,
            gateId,
            timestamp,
        }
    });
    await docClient.send(command);
}
