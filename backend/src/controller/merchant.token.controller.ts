import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { Merchant } from "../model/merchant.schema"
import { MerchantTokenService } from "../service/merchant.token.service";
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from 'src/plugins/redis-cache/redis-cache.service';
const crypto = require('crypto');

@Controller('/api/v1/public/merchant')
export class MerchantTokenController {
    constructor(private readonly merchantTokenService: MerchantTokenService,
        private readonly redisCacheService: RedisCacheService) { }


    @Get('/')
    async read(@Req() req){
        const data =  await this.merchantTokenService.read( req.query.token);
        const enc_k = crypto.randomBytes(32)
        const enc_i = crypto.randomBytes(16)
        let mrcht = {
            name       : data.account.name,
            street     : data.account.street,
            phone      : data.account.phone,
            enc_iv     : enc_i.toString('hex'),
            description: data.account.description
        }
        await this.redisCacheService.set({
          keys : { token: req.query.token, enc_iv: mrcht.enc_iv },
          value: { enc_key: enc_k.toString('hex') },
          ttl  : 60 * 60,
        });
        return mrcht
    }
    @Post('/')
    async create(@Req() req){

        const cache = await this.redisCacheService.get({
            keys:{ token   : req.body.token, enc_iv: req.body.enc_iv}
        });
        
        // Initializing the key
        const enc_key_buffer = Buffer.from(cache.enc_key, 'hex');
        // Initializing the iv vector
        const enc_iv_buffer = Buffer.from(req.body.enc_iv, 'hex');
        // Initializing the iv vector
        const iv = crypto.randomBytes(16);


        let cipher =
        crypto.createCipheriv('aes-256-cbc', enc_key_buffer, enc_iv_buffer);

        // Updating the encrypted text...
        let encrypted = cipher.update(JSON.stringify(req.body));

        // Using concatenation
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        let data  = encrypted.toString('hex')
        // Returning the iv vector along with the encrypted data
        return { iv: enc_iv_buffer.toString('hex'),
        encryptedData: encrypted.toString('hex') };

    }
}