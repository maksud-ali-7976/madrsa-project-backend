import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

import type { Ref } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "Students", timestamps: true } })
export class StudentClass {
  @prop({})
  public name!: string;

  @prop({})
  public guardian_name!: string;

  @prop({})
  public dob!: Date;

  @prop({})
  public class!: string;

  @prop({})
  public address!: string;

  @prop({})
  public contact!: string;

  @prop({})
  public adhar?: string;
}

export default getModelForClass(StudentClass);
