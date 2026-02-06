import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * Define the Backend architecture
 */
defineBackend({
    auth,
    data,
});
