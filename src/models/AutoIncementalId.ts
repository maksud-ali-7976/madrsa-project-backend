import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

export enum AutoIncIdModel {
    StoreEmployee = 0,
    StoreComplaint = 1,
    Driver = 2,
    DeliverVehicle = 3,
    PlantEmployee = 4,
}

@modelOptions({ schemaOptions: { collection: "autoincrementalid", timestamps: true } })
export class AutoIncementalIdClass {

    @prop({ enum: AutoIncIdModel, required: true, unique: true })
    public id!: number

    @prop({ default: 0 })
    public seq!: number

}

export default getModelForClass(AutoIncementalIdClass);
