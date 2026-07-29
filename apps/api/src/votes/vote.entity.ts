import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { User } from '../users/user.entity';

@Entity('votes')
@Unique(['pollId', 'userId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'pollId', type: 'integer' })
  pollId!: number;

  @ManyToOne(() => Poll, (poll: Poll) => poll.votes)
  @JoinColumn({ name: 'pollId' })
  poll!: Poll;

  @Column({ name: 'optionId', type: 'integer' })
  optionId!: number;

  @ManyToOne(() => PollOption, (option: PollOption) => option.votes)
  @JoinColumn({ name: 'optionId' })
  option!: PollOption;

  @Column({ name: 'userId', type: 'integer' })
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt!: Date;
}
