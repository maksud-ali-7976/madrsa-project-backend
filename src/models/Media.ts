import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "media", timestamps: true } })
export class MediaClass {
  @prop({})
  public file_name!: string;

  @prop({})
  public file_size!: string;

  @prop({})
  public file_url!: string;
}

export default getModelForClass(MediaClass);
