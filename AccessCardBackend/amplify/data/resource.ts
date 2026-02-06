import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
 * Data Schema Definition for AccessCard
 */
const schema = a.schema({
    // Student Model
    Student: a.model({
        firstName: a.string().required(),
        lastName: a.string().required(),
        grade: a.string().required(),
        classSection: a.string().required(),
        rollNumber: a.string().required(),
        photoUrl: a.string(),
        qrCode: a.string().required(), // Indexed for fast scanner lookup

        // Relationships
        guardians: a.hasMany('Guardian', 'studentId'),
        pickupHistory: a.hasMany('PickupEvent', 'studentId'),
    })
        .authorization(allow => [
            allow.group('Admin'),
            allow.group('Staff').to(['read']),
        ]),

    // Guardian Model
    Guardian: a.model({
        name: a.string().required(),
        relationship: a.string().required(),
        phone: a.string().required(),
        email: a.string(),
        photoUrl: a.string(),
        isApproved: a.boolean().default(true),

        // Foreign Key
        studentId: a.id(),
        student: a.belongsTo('Student', 'studentId'),
    })
        .authorization(allow => [
            allow.group('Admin'),
            allow.group('Staff').to(['read']),
        ]),

    // Staff Model (Security Guards & Supervisors)
    Staff: a.model({
        name: a.string().required(),
        email: a.string().required(),
        role: a.enum(['SECURITY_GUARD', 'SUPERVISOR']),
        status: a.enum(['ACTIVE', 'INACTIVE']),
        photoUrl: a.string(),

        // Relationships
        activity: a.hasMany('PickupEvent', 'staffId'),
    })
        .authorization(allow => [
            allow.group('Admin'),
        ]),

    // Pickup Event (The Scan Record)
    PickupEvent: a.model({
        timestamp: a.datetime().required(),
        status: a.enum(['APPROVED', 'DENIED', 'PENDING']),
        notes: a.string(),

        // Foreign Keys
        studentId: a.id(),
        student: a.belongsTo('Student', 'studentId'),

        guardianId: a.id(),
        guardian: a.belongsTo('Guardian', 'guardianId'),

        staffId: a.id(),
        staff: a.belongsTo('Staff', 'staffId'),
    })
        .authorization(allow => [
            allow.group('Admin'),
            allow.group('Staff'),
        ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
    },
});
