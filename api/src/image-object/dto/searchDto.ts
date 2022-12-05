import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
  IsDivisibleBy,
  IsBooleanString,
} from 'class-validator';
import { Samplers } from 'src/image-generation/dto/generateDto';

export class ImageSearchDto {
  // Prompt
  @IsString()
  @IsOptional()
  public prompt?: string;

  @IsString()
  @IsOptional()
  public negativePrompt?: string;

  // Configs
  @IsNumber()
  @Min(1)
  @Max(300)
  @IsOptional()
  public steps?: number;

  @IsString()
  @IsIn(Samplers)
  @IsOptional()
  public sampler?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(25)
  @IsOptional()
  public cfg?: number;

  @IsString()
  @IsOptional()
  public seed?: string;

  @IsNumber()
  @IsDivisibleBy(64)
  @IsOptional()
  public width?: number;

  @IsNumber()
  @IsDivisibleBy(64)
  @IsOptional()
  public height?: number;

  @IsString()
  @IsOptional()
  public model?: string;

  // Face restoration
  @IsBooleanString()
  @IsOptional()
  public faceRestoration?: boolean;
}
