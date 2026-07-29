import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            email: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
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
