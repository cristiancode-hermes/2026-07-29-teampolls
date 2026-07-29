import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: { username: string; email: string; password: string }) {
    const existingEmail = await this.usersService.findByEmail(data.email);
    if (existingEmail) throw new ConflictException('Email already in use');

    const existingUsername = await this.usersService.findByUsername(data.username);
    if (existingUsername) throw new ConflictException('Username already taken');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      username: data.username,
      email: data.email,
      passwordHash,
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
  }
}
