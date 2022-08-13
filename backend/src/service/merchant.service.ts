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
export class MerchantService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Merchant.name) private merchantModel: Model<MerchantDocument>,
        @InjectModel(MerchantToken.name) private merchantTokenModel: Model<MerchantTokenDocument>
    ) { }

    async create(account: User, merchant: Merchant, jwt: JwtService): Promise<any> {
        console.log(account)
        const foundAccount = await this.userModel.findOne({ email: account.email }).exec();
        let mrcht = {
            name: merchant.name,
            street: merchant.street,
            description: merchant.description,
            phone: merchant.phone,
            tag: 'WEB',
            user: foundAccount
        }
        const nmchant = new this.merchantModel(mrcht);
        const nm      = await nmchant.save()
        const payload = {
            _id       : nm._id,
            user_id   : foundAccount._id
        };
        let tok = {
            key: jwt.sign(payload),
            tag: 'WEB',
            account: nm
        }

        const nmchantToken   = new this.merchantTokenModel(tok)
        const nmchantTokenS  = await nmchantToken.save()
        nm.tokens.push(nmchantTokenS)
        await nm.save()
        foundAccount.accounts.push(nm)
        await foundAccount.save()
        
        return nmchantToken
    }

    async read(account: User): Promise<any> {
        console.log(account)
        const foundAccount = await this.merchantModel.find({ user: account }).populate('tokens').exec();
        return foundAccount
    }
    async update(id, merchant: Merchant): Promise<Merchant> {

        // const toUpdate = {
        //     ethers:merchant.ethers,
        //     price :merchant.price
        // }
        return await this.merchantModel.findByIdAndUpdate(id, merchant, { new: true })
    }
}