import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Max,
  Min,
  IsIn,
  IsDivisibleBy,
  IsOptional,
  IsBooleanString,
  IsArray,
} from 'class-validator';

export const Samplers = [
  'Euler a',
  'Euler',
  'LMS',
  'Heun',
  'DPM2',
  'DPM2 a',
  'DPM++ 2S a',
  'DPM++ 2M',
  'DPM++ SDE',
  'DPM fast',
  'DPM adaptive',
  'LMS Karras',
  'DPM2 Karras',
  'DPM2 a Karras',
  'DPM++ 2S a Karras',
  'DPM++ 2M Karras',
  'DPM++ SDE Karras',
  'DDIM',
  'PLMS',
] as const;

export class Text2ImageDto {
  // Prompt
  @IsNotEmpty()
  @IsString()
  public prompt: string;

  @IsString()
  @IsOptional()
  public negativePrompt?: string;

  // Configs
  @IsNumber()
  @Min(1)
  @Max(300)
  public steps: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(Samplers)
  public sampler: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(25)
  public cfg: number;

  @IsString()
  @IsOptional()
  public seed?: string;

  @IsNumber()
  @IsDivisibleBy(64)
  public width: number;

  @IsNumber()
  @IsDivisibleBy(64)
  public height: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public modelHash?: string;

  // High res
  @IsNumber()
  @IsOptional()
  public denoisingHr?: number;

  @IsNumber()
  @IsOptional()
  public firstPassHr?: number;

  // Face restoration
  @IsBooleanString()
  @IsOptional()
  public faceRestoration?: boolean;

  // Tags
  @IsOptional()
  @IsArray()
  public tags?: string[];
}
