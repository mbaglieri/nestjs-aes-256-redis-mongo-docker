import {
    Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import { Merchant, MerchantDocument } from "../model/merchant.schema";
import { JwtService } from '@nestjs/jwt';
import { MerchantToken, MerchantTokenDocument } from "../model/merchant.token.schema";

@Injectable()
export class MerchantTokenService {

    constructor(
        @InjectModel(MerchantToken.name) private merchantTokenModel: Model<MerchantTokenDocument>
    ) { }
    async read(token: String): Promise<any> {
        const tokenMerchant = await this.merchantTokenModel.findOne({ key: token }).populate('account').exec();
        return tokenMerchant
    }
    
}