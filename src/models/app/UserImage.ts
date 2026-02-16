import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import type { Ref } from "@typegoose/typegoose";
import { UserClass } from "./User";
import { ReadingClass } from "./UserReading";

@modelOptions({
  schemaOptions: { collection: "coffeeImage", timestamps: true },
})
export class coffeeImageClass {
  @prop({ ref: () => ReadingClass })
  public user_reading!: Ref<ReadingClass>;

  @prop({ ref: () => UserClass })
  public user!: Ref<UserClass>;

  @prop()
  public image!: string;

  @prop()
  public type!:string;
}

export default getModelForClass(coffeeImageClass);
