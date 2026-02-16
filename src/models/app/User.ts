import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import type { Ref } from "@typegoose/typegoose";
import { SubscriptionClass } from "./Subscriptions";

export enum UserSource {
	EMAIL = "EMAIL",
	GOOGLE = "GOOGLE",
	FACEBOOK = "FACEBOOK",
	APPLE = "APPLE",
}

@modelOptions({ schemaOptions: { collection: "user", timestamps: true } })
export class UserClass {
	@prop({})
	public name!: string;

	@prop({})
	public dob?: string;

	@prop({})
	public email?: string;

	@prop()
	public password?: string;

	@prop()
	public language?: string;

	@prop()
	public gender?: string;

	@prop()
	public address?: string;

	@prop()
	public token?: string;

	@prop({ default: "Free" })
	public subscriptionLevel!: string;

	@prop({ default: 0 })
	public availableReadings!: number;

	@prop({ default: 0 })
	public additionalAvailableReadings!: number;

	@prop({ default: "" })
	public availableReadingsText!: string;

	@prop({ default: "" })
	public photo!: string;

	@prop({ default: false })
	public isVerified!: boolean;

	@prop()
	public otp?: string;

	@prop({ ref: () => SubscriptionClass })
	public subscription!: Ref<SubscriptionClass>;

	@prop({ default: false })
	public isDeleted!: boolean;

	@prop({})
	public externalId?: string;

	@prop({ default: UserSource.EMAIL })
	public source!: string;

	@prop({})
	public sub!: string;

	@prop({ default: false })
	public is_lock!: boolean;
}

export default getModelForClass(UserClass);
