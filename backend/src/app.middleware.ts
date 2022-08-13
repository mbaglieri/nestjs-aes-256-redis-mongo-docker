
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccountService } from './service/account.service';
import { JwtService } from '@nestjs/jwt';
interface AccountRequest extends Request {
    account: any
}
@Injectable()
export class isAuthenticated implements NestMiddleware {
    constructor(private readonly accountService: AccountService, private readonly jwt: JwtService ) { }
    async use(req: AccountRequest, res: Response, next: NextFunction) {
        try{
            if ( 
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = await this.jwt.verify(token);
                const account = await this.accountService.getOne(decoded._id)
                if (account) {
                    req.account = account
                    next()
                } else {
                    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
                    
                }
            } else {
                throw new HttpException('No token found', HttpStatus.NOT_FOUND)
                
            }
        }catch {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
         
       }
    }
}