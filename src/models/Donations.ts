import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

export enum DonationsType {
  ZAKAT = "ZAKAT",
  SADQAH = "SADQAH",
  FIDYA = "FIDYA",
  NAFL = "NAFL",
  LILLAH = "LILLAH",
}

@modelOptions({ schemaOptions: { collection: "Donations", timestamps: true } })
export class DonationsClass {
  @prop({})
  public donar_name!: string;

  @prop({ type: ()=>String, enum: DonationsType, default: DonationsType.LILLAH })
  public type!: DonationsType;

  @prop({})
  public amount!: number;

  @prop({})
  public date!: Date;

  @prop({})
  public payment_method?: string;

  @prop({})
  public notes?: string;
}

export default getModelForClass(DonationsClass);
