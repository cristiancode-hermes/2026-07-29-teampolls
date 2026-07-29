import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(data: {
        username: string;
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            email: string;
        };
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            email: string;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        username: string;
        email: string;
        createdAt: Date;
    }>;
}
