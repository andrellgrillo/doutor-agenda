import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import * as schema from "@/db/schema";

import { db } from "../db";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: false,
    schema: {
      usersTable: schema.usersTable,
      sessionsTable: schema.sessionsTable,
      accountsTable: schema.accountsTable,
      verificationsTable: schema.verificationsTable,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    customSession(async ({ user, session }) => {
      const clinics = await db.query.userToClinicTable.findMany({
        where: eq(schema.userToClinicTable.userId, user.id),
        with: {
          clinic: true,
        },
      });
      // TODO: Ao adaptar para que o usuário possa ter mais de uma clínica,deve-se mudar o código
      const clinic = clinics?.[0];
      return {
        user: {
          ...user,
          clinic: clinic?.clinicId? {
            id: clinic?.clinicId,
            name: clinic?.clinic?.name,
          } : undefined,
        },
        session,
      };
    }),
  ],

  user: {
  modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});
