import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MerchantToken } from './merchant.token.schema';
import { User } from './user.schema';
import * as mongoose from "mongoose";

export type MerchantDocument = Merchant & Document;

@Schema({ timestamps: true })
export class Merchant {

  @Prop({required:true})
  name: string;

  @Prop({required:true})
  street: string;

  @Prop({required:true})
  description: string;

  @Prop({required:true})
  phone: string;

  @Prop({type: mongoose.Schema.Types.ObjectId ,ref: 'User',required:true})
  user: User;

  @Prop({type: [mongoose.Schema.Types.ObjectId ],ref: 'MerchantToken'})
  tokens: MerchantToken[];

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}
export const MerchantSchema = SchemaFactory.createForClass(Merchant);