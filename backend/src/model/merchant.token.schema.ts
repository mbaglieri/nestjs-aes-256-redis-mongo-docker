import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Merchant } from './merchant.schema';
import * as mongoose from "mongoose";

export type MerchantTokenDocument = MerchantToken & Document;

@Schema({ timestamps: true })
export class MerchantToken {

  @Prop({required:true})
  key: string;

  @Prop({required:true})
  tag: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Merchant" ,required:true})
  account: Merchant

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}
export const MerchantTokenSchema = SchemaFactory.createForClass(MerchantToken);
