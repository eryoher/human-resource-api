import { createApp } from "./app.js";
import { connectToDatabase } from "./config/database.js";

const dbClient = await connectToDatabase();
console.log(dbClient);
createApp({ dbClient });
