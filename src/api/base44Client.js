import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68eb69c51ce08e4c9fdca015", 
  requiresAuth: true // Ensure authentication is required for all operations
});
