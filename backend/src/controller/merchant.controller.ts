import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { Merchant } from "../model/merchant.schema"
import { MerchantService } from "../service/merchant.service";
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from 'src/plugins/redis-cache/redis-cache.service';

@Controller('/api/v1/merchant')
export class MerchantController {
    constructor(private readonly merchantService: MerchantService,
        private readonly redisCacheService: RedisCacheService,
        private jwtService: JwtService) { }


    @Get('/')
    async read(@Req() req){
        const data =  await this.merchantService.read( req.account);
        return data
    }

    @Post('/')
    async create(@Req() req,@Res() response, @Body() merchant: Merchant) {
        const data =  await this.merchantService.create( req.account, merchant, this.jwtService);
        let r_data = {
            key        : data.key,
            tag        : data.tag,
            name       : data.account.name,
            street     : data.account.street,
            description: data.account.description,
            phone      : data.phone
        }
        return response.status(HttpStatus.OK).json(r_data)
    }
}