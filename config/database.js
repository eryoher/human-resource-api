import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

export const connectToDatabase = () => {
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  });
};
