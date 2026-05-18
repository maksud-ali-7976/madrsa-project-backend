import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { StudentClass } from "./Student";
import { MadrasaClass } from "./Class";

@modelOptions({ schemaOptions: { collection: "Results", timestamps: true } })
export class ResultClass {
  @prop({ ref: () => StudentClass })
  public student!: Ref<StudentClass>;

  @prop({})
  public session!: string;

  @prop({ ref: () => MadrasaClass })
  public class!: Ref<MadrasaClass>;

  @prop({})
  public marks!: number;

  @prop({})
  public grade?: string;

  @prop({})
  public remarks?: string;

  @prop({ default: Date.now })
  public issue_date?: Date;

  @prop({ default: 0 })
  public total?: number

  @prop({})
  public percentage?: number
}
export default getModelForClass(ResultClass);
