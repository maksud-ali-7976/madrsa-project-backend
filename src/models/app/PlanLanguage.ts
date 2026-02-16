import {prop,getModelForClass,modelOptions} from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"
import { PlanClass } from "./Plan"

@modelOptions({schemaOptions:{collection:"planLng",timestamps:true}})
export class PlanLanguageClass {
    
    @prop({ref:()=>PlanClass})
    public plan?:Ref<PlanClass>

    @prop({})
    public name?:string

    @prop({})
    public language?:string

    @prop({})
    public benefit?:string
}

export default getModelForClass(PlanLanguageClass)