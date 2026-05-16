import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { RoleClass } from "./Role";
import type { Ref } from "@typegoose/typegoose";

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

  @prop({ ref: () => RoleClass })
  public role!: Ref<RoleClass>;

  @prop({ default: {} })
  public permissions!: any;

  @prop({ default: false })
  public super_admin!: boolean;
}

export type Abilities = 1 | 2 | 3 | 4;

export type Ability = Abilities[];

export interface Permission {
  [module: number]: {
    ability: Ability;
  };
}

export default getModelForClass(AdminClass);
