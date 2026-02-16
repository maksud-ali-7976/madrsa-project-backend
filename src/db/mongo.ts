import mongoose from "mongoose";
import env from "src/config/mongo";
import { seeder } from "./seeder";

export async function connectDB(thread: any) {
  try {
    mongoose.set("strict", false);
    mongoose.set("strictQuery", false);
    mongoose.set("strictPopulate", false);
    const db = await mongoose.connect(env.uri, { dbName: env.db_name });
    seeder();

    await db.connection
      .db!.collection("subscriptions")
      .createIndex(
        { user: 1, status: 1 },
        { unique: true, partialFilterExpression: { status: "active" } }
      );

    return db;
  } catch (error) {
  }
}
