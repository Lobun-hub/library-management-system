import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn!: string;

  @IsInt()
  @Min(1)
  totalCopies!: number;

  @IsString()
  @IsNotEmpty()
  genreId!: string;
}
