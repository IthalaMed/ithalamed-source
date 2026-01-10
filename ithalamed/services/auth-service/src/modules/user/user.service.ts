import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@ithalamed/database';
import { UserStatus, UserType } from '@ithalamed/common';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this. userRepository.findOne({
      where: { email:  email.toLowerCase() },
    });
  }

  /**
   * Find user by phone number
   */
  async findByPhone(phoneNumber: string): Promise<User | null> {
    return this. userRepository.findOne({
      where: { phoneNumber },
    });
  }

  /**
   * Create user (internal use)
   */
  async create(dto: CreateUserDto): Promise<User> {
    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: [
        { phoneNumber: dto.phoneNumber },
        .. .(dto.email ?  [{ email: dto.email. toLowerCase() }] : []),
      ],
    });

    if (existingUser) {
      throw new ConflictException('User with this phone or email already exists');
    }

    const user = this.userRepository.create({
      ...dto,
      email: dto.email?.toLowerCase(),
      status: dto.status || UserStatus.PENDING_VERIFICATION,
    });

    return this.userRepository.save(user);
  }

  /**
   * Update user
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for email uniqueness if updating email
    if (dto.email && dto.email !== user.email) {
      const existingWithEmail = await this.findByEmail(dto.email);
      if (existingWithEmail && existingWithEmail.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update fields
    Object.assign(user, {
      ...dto,
      email: dto.email?.toLowerCase(),
    });

    return this.userRepository.save(user);
  }

  /**
   * Update user status
   */
  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    return this. userRepository.save(user);
  }

  /**
   * Soft delete user
   */
  async softDelete(id: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.softDelete(id);
  }

  /**
   * Find users by type
   */
  async findByType(
    userType: UserType,
    options?: {
      limit?:  number;
      offset?: number;
      status?: UserStatus;
    },
  ): Promise<{ users: User[]; total: number }> {
    const { limit = 50, offset = 0, status } = options || {};

    const whereCondition:  any = { userType };
    if (status) {
      whereCondition.status = status;
    }

    const [users, total] = await this. userRepository.findAndCount({
      where: whereCondition,
      order: { createdAt:  'DESC' },
      skip: offset,
      take: limit,
    });

    return { users, total };
  }

  /**
   * Search users
   */
  async search(
    query: string,
    options?: {
      limit?:  number;
      offset?: number;
      userType?: UserType;
    },
  ): Promise<{ users: User[]; total: number }> {
    const { limit = 50, offset = 0, userType } = options || {};

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where(
        '(user.firstName ILIKE :query OR user.lastName ILIKE :query OR user.email ILIKE :query OR user.phoneNumber ILIKE : query)',
        { query: `%${query}%` },
      );

    if (userType) {
      queryBuilder.andWhere('user.userType = :userType', { userType });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }
}
