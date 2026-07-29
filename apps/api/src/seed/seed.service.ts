import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Poll } from '../polls/poll.entity';
import { PollOption } from '../poll-options/poll-option.entity';
import { Vote } from '../votes/vote.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Poll) private pollsRepo: Repository<Poll>,
    @InjectRepository(PollOption) private optionsRepo: Repository<PollOption>,
    @InjectRepository(Vote) private votesRepo: Repository<Vote>,
  ) {}

  async onModuleInit() {
    if (!this.configService.get<string>('SEED_DB')) return;
    await this.seed();
  }

  async seed() {
    const existing = await this.usersRepo.findOne({ where: { username: 'demo' } });
    if (existing) {
      console.log('Database already seeded, skipping.');
      return;
    }

    console.log('Seeding database...');

    // Create demo user
    const passwordHash = await bcrypt.hash('demo1234', 10);
    const user = this.usersRepo.create({
      username: 'demo',
      email: 'demo@teampolls.dev',
      passwordHash,
    } as any);
    const savedUser = await this.usersRepo.save(user) as unknown as User;

    const user2 = this.usersRepo.create({
      username: 'alice',
      email: 'alice@teampolls.dev',
      passwordHash,
    } as any);
    const savedUser2 = await this.usersRepo.save(user2) as unknown as User;

    // Create polls
    const poll1 = this.pollsRepo.create({
      title: 'What tech stack for the new project?',
      description: 'We need to decide between these frontend frameworks',
      status: 'open',
      createdById: savedUser.id,
    } as any);
    const savedPoll1 = await this.pollsRepo.save(poll1) as unknown as Poll;

    const poll2 = this.pollsRepo.create({
      title: 'Best day for team lunch?',
      description: 'Vote for your preferred day for our monthly team lunch',
      status: 'closed',
      createdById: savedUser.id,
    } as any);
    const savedPoll2 = await this.pollsRepo.save(poll2) as unknown as Poll;

    const poll3 = this.pollsRepo.create({
      title: 'Which conference should we attend?',
      description: null,
      status: 'open',
      isAnonymous: true,
      createdById: savedUser2.id,
    } as any);
    const savedPoll3 = await this.pollsRepo.save(poll3) as unknown as Poll;

    // Create options
    const opts1Data = ['React', 'Vue', 'Svelte', 'Solid.js'];
    const opts1 = await Promise.all(
      opts1Data.map((text) => {
        const opt = this.optionsRepo.create({ pollId: savedPoll1.id, text } as any);
        return this.optionsRepo.save(opt) as unknown as PollOption;
      })
    );

    const opts2Data = ['Monday', 'Wednesday', 'Friday'];
    const opts2 = await Promise.all(
      opts2Data.map((text) => {
        const opt = this.optionsRepo.create({ pollId: savedPoll2.id, text } as any);
        return this.optionsRepo.save(opt) as unknown as PollOption;
      })
    );

    const opts3Data = ['React Summit', 'JSConf', 'VueConf', 'Svelte Summit'];
    const opts3 = await Promise.all(
      opts3Data.map((text) => {
        const opt = this.optionsRepo.create({ pollId: savedPoll3.id, text } as any);
        return this.optionsRepo.save(opt) as unknown as PollOption;
      })
    );

    // Cast some votes
    await Promise.all([
      this.votesRepo.create({ pollId: savedPoll1.id, optionId: opts1[0].id, userId: savedUser.id } as any),
      this.votesRepo.create({ pollId: savedPoll1.id, optionId: opts1[0].id, userId: savedUser2.id } as any),
      this.votesRepo.create({ pollId: savedPoll2.id, optionId: opts2[0].id, userId: savedUser.id } as any),
      this.votesRepo.create({ pollId: savedPoll2.id, optionId: opts2[2].id, userId: savedUser2.id } as any),
      this.votesRepo.create({ pollId: savedPoll3.id, optionId: opts3[1].id, userId: savedUser.id } as any),
    ].map((v) => this.votesRepo.save(v)));

    console.log('Seed data created successfully.');
    console.log('  Demo user: demo@teampolls.dev / demo1234');
    console.log('  Second user: alice@teampolls.dev / demo1234');
  }
}
