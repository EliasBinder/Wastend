import { Lucia, RegisteredDatabaseUserAttributes } from "lucia";
import mongoose from "mongoose";
import { sleep } from "bun";
import { luciaAdapter } from "./model";

export const auth = new Lucia(luciaAdapter as any, {
  sessionCookie: {
    attributes: {
      secure: process.env.ENV === "PROD",
    },
  },

  getUserAttributes: (
    databaseUserAttributes: RegisteredDatabaseUserAttributes,
  ) => {
    return {
      email: databaseUserAttributes.email,
      first_name: databaseUserAttributes.first_name,
      last_name: databaseUserAttributes.last_name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  first_name: string;
  last_name: string;
}

export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}. Retrying...`);
    await sleep(1000);
    await connect();
  }
};
