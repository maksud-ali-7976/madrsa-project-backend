import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { AdminClass } from "./Admin";

import type { Ref } from "@typegoose/typegoose"

@modelOptions({
  schemaOptions: {
    collection: "classes",
    timestamps: true,
  },
})
export class MadrasaClass {
  @prop({ required: true, unique: true })
  name!: string;

  // Baghdadi Qaida
  // Madni Qaida
  // Nazra
  // Hifz etc

  @prop()
  description?: string;

  @prop({ ref: () => AdminClass })
  teacher?: Ref<AdminClass>;

  @prop({ default: true })
  active!: boolean;
}

export default getModelForClass(MadrasaClass);
