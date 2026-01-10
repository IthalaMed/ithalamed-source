import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { User } from '@ithalamed/database';
import { UserType } from '@ithalamed/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, Roles } from '../auth/decorators';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getCurrentUser(@CurrentUser() user: User) {
    return this.sanitizeUser(user);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(user.id, dto);
    return this.sanitizeUser(updatedUser);
  }

  @Get(': id')
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.SYSTEM)
  @ApiOperation({ summary:  'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService. findById(id);
    if (!user) {
      return null;
    }
    return this.sanitizeUser(user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.SYSTEM)
  @ApiOperation({ summary: 'Search users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users found' })
  async searchUsers(
    @Query('q') query?: string,
    @Query('userType') userType?: UserType,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    if (query) {
      const { users, total } = await this. userService.search(query, {
        limit,
        offset,
        userType,
      });
      return {
        users: users.map(u => this.sanitizeUser(u)),
        total,
      };
    }

    if (userType) {
      const { users, total } = await this.userService.findByType(userType, {
        limit,
        offset,
      });
      return {
        users: users. map(u => this.sanitizeUser(u)),
        total,
      };
    }

    return { users: [], total: 0 };
  }

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      profilePhotoUrl: user. profilePhotoUrl,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      mfaEnabled: user.mfaEnabled,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
