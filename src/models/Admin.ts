import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "Admin", timestamps: true } })
export class AdminClass {
  @prop({})
  public name!: string;

  @prop({})
  public email!: string;

  @prop({})
  public password!: string;

  @prop({})
  public password_unHashed?: string;

  @prop({})
  public phone!: string;
}

export default getModelForClass(AdminClass);
