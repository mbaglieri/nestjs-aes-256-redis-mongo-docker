import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { MerchantTx } from "../model/merchant.tx.schema"
import { MerchantTxService } from "../service/merchant.tx.service";
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from 'src/plugins/redis-cache/redis-cache.service';

@Controller('/api/v1/public/merchant/tx')
export class MerchantTxController {
    constructor(private readonly merchantTxService: MerchantTxService,
        private readonly redisCacheService: RedisCacheService) { }


    @Post('/')
    async create(@Req() req,@Res() response, @Body() merchant: MerchantTx) {
        const data =  await this.merchantTxService.create( req.body, this.redisCacheService);
       
        return response.status(HttpStatus.OK).json(data)
    }
}