import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";

import type { Ref } from "@typegoose/typegoose";

import { StudentClass } from "./Student";
import { MadrasaClass } from "./Class";

export enum StatusEnum {
  PRESENT = "present",
  ABSENT = "absent",
  LEAVE = "leave",
}

@modelOptions({
  schemaOptions: {
    collection: "attendance",
    timestamps: true,
  },
})
export class AttendanceClass {
  @prop({ ref: () => StudentClass, required: true })
  student!: Ref<StudentClass>;

  @prop({ ref: () => MadrasaClass, required: true })
  class!: Ref<MadrasaClass>;

  @prop({ required: true })
  date!: Date;

  @prop({
    enum: StatusEnum,
    default: StatusEnum.PRESENT,
  })
  status!: string;

  @prop()
  remarks?: string;
}

export default getModelForClass(AttendanceClass);
