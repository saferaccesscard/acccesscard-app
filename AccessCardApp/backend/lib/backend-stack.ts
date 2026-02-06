import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ========================================================================
    // 1. DynamoDB Tables
    // ========================================================================

    // Institutions Table
    const institutionsTable = new dynamodb.Table(this, 'InstitutionsTable', {
      partitionKey: { name: 'institutionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN for production
    });

    // Users Table
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    usersTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Students Table
    const studentsTable = new dynamodb.Table(this, 'StudentsTable', {
      partitionKey: { name: 'studentId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    studentsTable.addGlobalSecondaryIndex({
      indexName: 'InstitutionIndex',
      partitionKey: { name: 'institutionId', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Access Logs Table
    const accessLogsTable = new dynamodb.Table(this, 'AccessLogsTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING }, // LOG#{timestamp}
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING }, // STUDENT#{studentId}
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Devices Table
    const devicesTable = new dynamodb.Table(this, 'DevicesTable', {
      partitionKey: { name: 'deviceId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ========================================================================
    // 2. Cognito User Pool
    // ========================================================================

    const userPool = new cognito.UserPool(this, 'AccessCardUserPool', {
      selfSignUpEnabled: false, // Only Admins create users
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'AccessCardUserPoolClient', {
      userPool,
      authFlows: {
        userSrp: true,
      },
    });

    // User Groups
    new cognito.CfnUserPoolGroup(this, 'GroupAdmin', {
      userPoolId: userPool.userPoolId,
      groupName: 'ADMIN',
      description: 'Institution Administrators',
    });

    new cognito.CfnUserPoolGroup(this, 'GroupSecurity', {
      userPoolId: userPool.userPoolId,
      groupName: 'SECURITY',
      description: 'Gate Security Staff',
    });

    new cognito.CfnUserPoolGroup(this, 'GroupParentStudent', {
      userPoolId: userPool.userPoolId,
      groupName: 'PARENT_STUDENT',
      description: 'Parents and Students',
    });

    // ========================================================================
    // 3. S3 Bucket (Student Photos)
    // ========================================================================

    const studentPhotosBucket = new s3.Bucket(this, 'StudentPhotosBucket', {
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
          allowedOrigins: ['*'], // Restrict this in production
          allowedHeaders: ['*'],
        },
      ],
    });

    // ========================================================================
    // 4. Outputs
    // ========================================================================

    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'InstitutionsTableName', { value: institutionsTable.tableName });
    new cdk.CfnOutput(this, 'StudentPhotosBucketName', { value: studentPhotosBucket.bucketName });

    // ========================================================================
    // 5. Lambda Functions
    // ========================================================================

    const createStudentFunction = new nodejs.NodejsFunction(this, 'CreateStudentFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../lambda/student/create.ts'),
      handler: 'handler',
      environment: {
        TABLE_NAME: studentsTable.tableName,
      },
    });
    studentsTable.grantReadWriteData(createStudentFunction);

    const verifyScanFunction = new nodejs.NodejsFunction(this, 'VerifyScanFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../lambda/scan/verify.ts'),
      handler: 'handler',
      environment: {
        STUDENTS_TABLE: studentsTable.tableName,
        LOGS_TABLE: accessLogsTable.tableName,
      },
    });
    studentsTable.grantReadData(verifyScanFunction);
    accessLogsTable.grantWriteData(verifyScanFunction);
  }
}
