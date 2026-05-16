import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

import type { Ref } from "@typegoose/typegoose";
import Class, { MadrasaClass } from "./Class";

@modelOptions({ schemaOptions: { collection: "Students", timestamps: true } })
export class StudentClass {
  @prop({})
  public name!: string;

  @prop({})
  public guardian_name!: string;

  @prop({})
  public dob!: Date;

  @prop({ ref: () => MadrasaClass })
  public class!: Ref<MadrasaClass>;

  @prop({})
  public address!: string;

  @prop({})
  public contact!: string;

  @prop({})
  public adhar?: string;

  @prop({})
  public photo?: string;
}

export default getModelForClass(StudentClass);
