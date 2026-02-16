import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import type { Ref } from "@typegoose/typegoose";
// import { UserClass } from "./User";
import { PlanClass } from "./Plan";

const UserClass = () => require("./User").UserClass;
@modelOptions({
	schemaOptions: { collection: "subscription", timestamps: true },
})
export class SubscriptionClass {
	@prop({ ref: () => UserClass })
	public user!: Ref<typeof UserClass>;

	@prop({ ref: () => PlanClass })
	public plan!: Ref<PlanClass>;

	@prop()
	public startDate!: Date;

	@prop()
	public endDate!: Date;

	@prop({ default: "active" })
	public status!: string;

	@prop({ default: true })
	public autoRenew?: boolean;

	@prop({ default: false })
	public pendingCancel?: boolean;

	@prop({ default: "subscription" })
	public type!: string;

	@prop({})
	public store_transaction_id!: string;

	@prop({})
	public description!: string;
}

export default getModelForClass(SubscriptionClass);
