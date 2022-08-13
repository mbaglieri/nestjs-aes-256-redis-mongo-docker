import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UploadedFiles, Put, Req, Res } from "@nestjs/common";
import { User } from "../model/user.schema";
import { AccountService } from "../service/account.service";
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from 'src/plugins/redis-cache/redis-cache.service';


@Controller('/api/v1/account')
export class AccountController {
    constructor(private readonly accountService: AccountService,
        private readonly redisCacheService: RedisCacheService,
        private jwtService: JwtService
    ) { }

    @Get('/me')
    async read(@Req() req){
        return {
            _id     : req.account._id,
            number  : req.account.email,
            accounts: req.account.accounts
        };
    }

    @Post('/signin')
    async SignIn(@Res() response, @Body() user: User) {
        const data = await this.accountService.signin(user, this.jwtService);
        return response.status(HttpStatus.OK).json(data)
    }

    @Post('/signup')
    async SignUp(@Res() response, @Body() user: User) {
        const data = await this.accountService.signup(user, this.jwtService);

        return response.status(HttpStatus.OK).json(data)
    }
}