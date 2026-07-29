import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    create(data: {
        username: string;
        email: string;
        passwordHash: string;
    }): Promise<User>;
}
