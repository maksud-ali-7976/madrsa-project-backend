import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import * as mongoose from "mongoose";

@modelOptions({ schemaOptions: { collection: "admin", timestamps: true } })
export class AdminClass {
    @prop({ required: true, unique: true })
    public adminId!: number;

    @prop({ required: true })
    public password!: string;

    @prop({ default: true })
    public isActive!: boolean;
}

export default getModelForClass(AdminClass); 