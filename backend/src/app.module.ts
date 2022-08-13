
import { Module, RequestMethod, MiddlewareConsumer} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MerchantTokenController } from './controller/merchant.token.controller';
import { MerchantTxController } from './controller/merchant.tx.controller';
import { MerchantController } from './controller/merchant.controller';
import { MerchantService } from './service/merchant.service';
import { MerchantTokenService } from './service/merchant.token.service';
import { MerchantTxService } from './service/merchant.tx.service';
import { AccountService } from './service/account.service';
import { AccountController } from './controller/account.controller';

import { User, UserSchema } from "./model/user.schema";
import { MerchantToken, MerchantTokenSchema } from "./model/merchant.token.schema";
import { Merchant, MerchantSchema } from "./model/merchant.schema";
import { MerchantTx, MerchantTxSchema } from "./model/merchant.tx.schema";

import { isAuthenticated } from './app.middleware';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from 'nestjs-http-promise'
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { RedisCacheModule } from './plugins/redis-cache/redis-cache.module';
 
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout     : 5000,
        maxRedirects: 5,
      }),
    }),
    JwtModule.register({
     secret,
     signOptions: { expiresIn: '2h' },
   }),
    MongooseModule.forRoot(process.env.DATABASE),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: MerchantToken.name, schema: MerchantTokenSchema }]),
    MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }]),
    MongooseModule.forFeature([{ name: MerchantTx.name, schema: MerchantTxSchema }]),
    RedisCacheModule,
 ],

controllers: [AppController, MerchantController, MerchantTokenController,MerchantTxController, AccountController],
providers  : [AppService, MerchantService, MerchantTokenService,MerchantTxService, AccountService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .forRoutes(MerchantController);

    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/account/signin', method: RequestMethod.POST },
        { path: 'api/v1/account/signup', method: RequestMethod.POST }
      )
      .forRoutes(AccountController);

    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: '/api/v1/public/merchant', method: RequestMethod.GET },
        { path: '/api/v1/public/merchant', method: RequestMethod.POST }
      )
      .forRoutes(MerchantTokenController);

    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: '/api/v1/public/merchant/tx', method: RequestMethod.POST }
      )
      .forRoutes(MerchantTxController);

      
  }
}
 