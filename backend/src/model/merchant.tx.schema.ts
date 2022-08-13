import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Merchant } from './merchant.schema';
import { MerchantToken } from './merchant.token.schema';
import * as mongoose from "mongoose";

export type MerchantTxDocument = MerchantTx & Document;

@Schema({ timestamps: true })
export class MerchantTx {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Merchant" ,required:true})
  account: Merchant

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "MerchantToken" ,required:true})
  token: MerchantToken

  @Prop({required:true})
  payload: string;

  @Prop({required:true})
  address: string;

  @Prop({required:true})
  name: string;

  @Prop({required:true})
  card_ending: string;


  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}
export const MerchantTxSchema = SchemaFactory.createForClass(MerchantTx);
