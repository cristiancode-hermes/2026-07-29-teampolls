import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreatePollDto } from './dto/create-poll.dto';
import { AddOptionsDto } from './dto/add-options.dto';

@ApiTags('Polls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.pollsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findById(id);
  }

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreatePollDto) {
    return this.pollsService.create(userId, dto);
  }

  @Post(':id/close')
  close(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
    return this.pollsService.close(id, userId);
  }

  @Post(':id/reopen')
  reopen(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
    return this.pollsService.reopen(id, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
    return this.pollsService.remove(id, userId);
  }
}
