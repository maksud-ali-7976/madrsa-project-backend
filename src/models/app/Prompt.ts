import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import type { Ref } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "prompt", timestamps: true } })
export class PromptClass {
	@prop()
	public title!: string;

	@prop()
	public analyze!: string;

	@prop()
	public generate!: string;

	@prop({ default: false })
	public default!: boolean;
}

export default getModelForClass(PromptClass);
