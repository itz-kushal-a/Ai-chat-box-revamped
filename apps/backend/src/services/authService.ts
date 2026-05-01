import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './dbService';
import { AuthRequest, AuthResponse, User } from '@ai-chat-box/shared';
import { AppError } from '../utils/appError';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  async signup(data: AuthRequest): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
    });

    const token = this.generateToken(user.id);

    return {
      user: this.formatUser(user),
      token,
    };
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user.id);

    return {
      user: this.formatUser(user),
      token,
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  private formatUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.getTime(),
    };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }
}

export const authService = new AuthService();
