import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { JwtStrategy } from './jwt.strategy';

/**
 * Auth Module for Patient Service
 *
 * MINIMAL module - only provides JWT validation. 
 * All auth business logic is in the Auth Service.
 *
 * Uses: 
 * - JwtStrategy: Extends SimpleJwtStrategy from @ithalamed/common
 * - Guards: JwtAuthGuard, RolesGuard imported from @ithalamed/common in AppModule
 * - Decorators: @CurrentUser, @Roles, @Public from @ithalamed/common
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
