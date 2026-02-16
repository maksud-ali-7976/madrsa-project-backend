import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import type { Ref } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "plan", timestamps: true } })
export class PlanClass {
  @prop()
  public title!: string;

  @prop()
  public price!: number;

  @prop()
  public discounted_price!: number;

  @prop({})
  public duration?: string;

  @prop({ default: 0 })
  public days?: number;

  @prop()
  public benefit!: string;

  @prop()
  public productId?: string;

  @prop({ default: 0 })
  public readings?: number;
}

export default getModelForClass(PlanClass);
