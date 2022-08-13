import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Merchant } from './merchant.schema';
import * as mongoose from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @Prop({required:true, unique:true})
  email: string;

  @Prop({required:true})
  passwd: string;

  @Prop({type: [mongoose.Schema.Types.ObjectId ],ref: 'Merchant'})
  accounts: Merchant[];

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}




export const UserSchema = SchemaFactory.createForClass(User);