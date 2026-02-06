import { defineAuth } from '@aws-amplify/backend';

/**
 * Define Authentication with Cognito
 * - Email login for Staff and Admin
 */
export const auth = defineAuth({
    loginWith: {
        email: true,
    },
    groups: ['Admin', 'Staff', 'Guardian'],
});
