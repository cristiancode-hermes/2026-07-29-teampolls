import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Poll } from '../polls/poll.entity';
import { Vote } from '../votes/vote.entity';

@Entity('poll_options')
export class PollOption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'pollId', type: 'integer' })
  pollId!: number;

  @ManyToOne(() => Poll, (poll: Poll) => poll.options)
  @JoinColumn({ name: 'pollId' })
  poll!: Poll;

  @Column({ type: 'varchar', length: 255 })
  text!: string;

  @OneToMany(() => Vote, (vote: Vote) => vote.option)
  votes!: Vote[];
}
