import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Poll } from '../polls/poll.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'passwordHash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;

  @OneToMany(() => Poll, (poll: Poll) => poll.createdBy)
  polls!: Poll[];
}
