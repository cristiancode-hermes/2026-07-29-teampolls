import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { Vote } from '../votes/vote.entity';

export type PollStatus = 'open' | 'closed';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'createdById', type: 'integer' })
  createdById!: number;

  @ManyToOne(() => User, (user: User) => user.polls)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;

  @Column({ name: 'deadline', type: 'datetime', nullable: true })
  deadline!: Date | null;

  @Column({ name: 'isAnonymous', type: 'boolean', default: false })
  isAnonymous!: boolean;

  @Column({ type: 'varchar', length: 10, default: 'open' })
  status!: PollStatus;

  @OneToMany(() => PollOption, (option: PollOption) => option.poll)
  options!: PollOption[];

  @OneToMany(() => Vote, (vote: Vote) => vote.poll)
  votes!: Vote[];
}
