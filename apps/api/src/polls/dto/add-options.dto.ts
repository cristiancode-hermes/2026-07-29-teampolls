import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddOptionsDto {
  @ApiProperty({ example: ['Option A', 'Option B'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  texts!: string[];
}
