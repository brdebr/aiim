import { IsNotEmpty, IsString } from 'class-validator';

export class setSdModelDto {
  @IsNotEmpty()
  @IsString()
  modelTitle: string;
}
