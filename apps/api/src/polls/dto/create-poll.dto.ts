import { IsString, IsOptional, IsBoolean, IsDateString, MinLength, MaxLength, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePollDto {
  @ApiProperty({ example: 'What tech stack should we use for the new project?' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'We need to decide between React, Vue, and Svelte for our frontend' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-08-05T23:59:00Z' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({ example: ['React', 'Vue', 'Svelte'] })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options!: string[];
}
