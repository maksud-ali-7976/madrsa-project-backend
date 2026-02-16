import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import type { Ref } from "@typegoose/typegoose";
import { UserClass } from "./User";

@modelOptions({ schemaOptions: { collection: "reading", timestamps: true } })
export class ReadingClass {
  @prop()
  public content!: string;

  @prop({ ref: () => UserClass })
  public user!: Ref<UserClass>;

  @prop({ enum: ["pending", "completed"], default: "pending" })
  public status!: string;

  @prop({ default: "" })
  public message?: string;
}

export default getModelForClass(ReadingClass);
