import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Merchant, MerchantDocument } from "../model/merchant.schema";
import { User, UserDocument } from "../model/user.schema";
import { ConfigService } from '@nestjs/config';
import { HttpService } from 'nestjs-http-promise'
import { getMonthDifference } from '../utils/base'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AccountService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly config: ConfigService,
        private readonly http: HttpService,
    ) { }

    async signin(user: User, jwt: JwtService): Promise<any> {
        var foundAccount = await this.userModel.findOne({ email: user.email })
            .populate("accounts", Merchant.name).exec();
            
        if (!foundAccount) {
            return new HttpException('No account', HttpStatus.UNAUTHORIZED);
        }
        const payload = {
            _id       : foundAccount._id,
            email     : foundAccount.email
        };
        return {
            token: jwt.sign(payload),
        };
    }
    async getOne(_id: string): Promise<any> {
        const foundAccount = await this.userModel.findOne({ _id: _id }).populate('accounts').exec();
        if (foundAccount) {
            return foundAccount
        }else{
            return new HttpException('No account to check', HttpStatus.UNAUTHORIZED);
        }
    }    
    async signup(user: User, jwt: JwtService): Promise<any> {
        var foundAccount = await this.userModel.findOne({ email: user.email })
            .exec();
            
        if (!foundAccount) {
            if(!user.email){
                return new HttpException('No account to check', HttpStatus.UNAUTHORIZED)
            }

            const fAccount =  new this.userModel(user);
            const foundAccount = await fAccount.save();
        }
        const payload = {
            _id       : foundAccount._id,
            email     : foundAccount.email
        };
        return {
            token: jwt.sign(payload),
        };
    }
}