import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import { MerchantTx, MerchantTxDocument } from "../model/merchant.tx.schema";
import { MerchantToken, MerchantTokenDocument } from "../model/merchant.token.schema";
import { RedisCacheService } from 'src/plugins/redis-cache/redis-cache.service';
const crypto = require('crypto');
const R      = require('ramda');

@Injectable()
export class MerchantTxService {

    constructor(
        @InjectModel(MerchantTx.name) private merchantTxModel: Model<MerchantTxDocument>,
        @InjectModel(MerchantToken.name) private merchantTokenModel: Model<MerchantTokenDocument>
    ) { }

    async create(parms: any,redisCacheService:RedisCacheService): Promise<any> {
        console.log(parms)

        const cache = await redisCacheService.get({
            keys:{ token   : parms.token, enc_iv: parms.enc_iv}
        });
        const tokenMerchant = await this.merchantTokenModel.findOne({ key: parms.token }).populate('account').exec();
        
        if (!tokenMerchant) {
            return new HttpException('No account to check', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        let iv            = Buffer.from(parms.enc_iv, 'hex');
        let encryptedText = Buffer.from(parms.payload, 'hex');
        let decipher      = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cache.enc_key, 'hex'), iv);
        let decrypted     = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);
        //Process Tx
        const tx = JSON.parse(decrypted.toString())
        console.log(tx)

        var ensureOnlyNumbers  = R.replace(/[^0-9]+/g, '');
        var maskAllButLastFour = R.replace(/[0-9](?=([0-9]{4}))/g, '*');
        var hashedCardNumber   = R.compose(maskAllButLastFour, ensureOnlyNumbers);
        console.log(hashedCardNumber(tx.card.toString()))
        let tx_pr = {
            payload    : parms.payload,
            address    : tx.address,
            name       : tx.name,
            card_ending: hashedCardNumber(tx.card.toString()),
            token      : tokenMerchant,
            account    : tokenMerchant.account
        }
        const nmchant = new this.merchantTxModel(tx_pr);
        const nm      = await nmchant.save()
      
        
        return nm
    }

}