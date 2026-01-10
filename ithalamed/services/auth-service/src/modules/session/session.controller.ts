import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';

import { User } from '@ithalamed/database';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary:  'Get all active sessions for current user' })
  @ApiResponse({ status: 200, description: 'List of active sessions' })
  async getActiveSessions(@CurrentUser() user: User) {
    const sessions = await this.sessionService. findUserActiveSessions(user.id);

    return sessions.map(session => ({
      id: session.id,
      deviceType: session.deviceType,
      deviceName: session.deviceName,
      platform: session.platform,
      ipAddress: session.ipAddress,
      location: session.location,
      lastActivityAt: session.lastActivityAt,
      createdAt: session.createdAt,
      isCurrent: false, // TODO: Mark current session
    }));
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Terminate a specific session' })
  @ApiResponse({ status: 200, description:  'Session terminated' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async terminateSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: User,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    // Verify session belongs to user
    const session = await this. sessionService.findById(sessionId);
    
    if (!session || session.userId !== user.id) {
      return { message: 'Session not found' };
    }

    await this.sessionService.terminateSession(sessionId, 'user_terminated');
    return { message: 'Session terminated successfully' };
  }

  @Post('terminate-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Terminate all other sessions' })
  @ApiResponse({ status: 200, description:  'Sessions terminated' })
  async terminateAllOtherSessions(
    @CurrentUser() user: User,
    @Req() req: Request,
  ): Promise<{ message: string; terminatedCount: number }> {
    // TODO: Exclude current session from termination
    const terminatedCount = await this.sessionService.terminateAllUserSessions(
      user.id,
      'user_terminated_all',
    );

    return {
      message: 'All other sessions terminated',
      terminatedCount,
    };
  }
}
