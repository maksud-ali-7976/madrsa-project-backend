import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { UserClass } from "./User";
import { PlanClass } from "./Plan";

@modelOptions({ schemaOptions: { collection: "revenue", timestamps: true } })
export class RevenueClass {
  @prop({ ref: () => UserClass })
  public user?: Ref<UserClass>;

  @prop({ ref: () => PlanClass })
  public plan?: Ref<PlanClass>;

  @prop({})
  public amount?: number;

  @prop({})
  paymentGateway?: string;

  @prop({})
  paymentId?: string;

  @prop({})
  public type?: string;
}

export default getModelForClass(RevenueClass);
