import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

const ALLOWED_SIGNUP_ROLES = ['vendor', 'customer'];

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  user: {
    modelName: 'users',
    additionalFields: {
      role: { type: 'string', required: false, defaultValue: 'customer', input: true },
      businessName: { type: 'string', required: false, input: true },
      isBlocked: { type: 'boolean', required: false, defaultValue: false, input: false },
      subscriptionPlan: { type: 'string', required: false, defaultValue: 'free', input: false },
      subscriptionExpiresAt: { type: 'date', required: false, input: false },
    },
  },

 emailAndPassword: { enabled: true, minPasswordLength: 6 },
   socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Security: nobody can register as admin, whatever they send
        before: async (user) => {
          const role = ALLOWED_SIGNUP_ROLES.includes(user.role) ? user.role : 'customer';
          return { data: { ...user, role } };
        },
      },
      update: {
        // Security: users can never change their own role or subscription
        before: async (data) => {
          const {
            role,
            isBlocked,
            subscriptionPlan,
            subscriptionExpiresAt,
            ...safeData
          } = data;
          return { data: safeData };
        },
      },
    },
  },
});