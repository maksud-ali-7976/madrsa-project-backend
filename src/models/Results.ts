import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { StudentClass } from "./Student";

@modelOptions({ schemaOptions: { collection: "Results", timestamps: true } })
export class ResultClass {
  @prop({ ref: () => StudentClass })
  public student!: Ref<StudentClass>;

  @prop({})
  public session!: string;

  @prop({})
  public class!: string;

  @prop({})
  public marks!: number;

  @prop({})
  public grade?: string;

  @prop({})
  public remarks?: string;

  @prop({ default: Date.now })
  public issue_date?: Date;
}
export default getModelForClass(ResultClass);
