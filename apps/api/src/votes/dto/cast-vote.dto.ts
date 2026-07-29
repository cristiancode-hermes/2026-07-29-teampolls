import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CastVoteDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  pollId!: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  optionId!: number;
}
