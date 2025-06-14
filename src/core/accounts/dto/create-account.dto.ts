import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import type { Account } from "../types/user.type.js";

export class CreateAccountDto {
  @IsString()
  @ApiProperty({
    example: "Muhammad",
    description: "The first name of the user",
  })
  public readonly firstName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: "Ali",
    description: "The last name of the user",
  })
  public readonly lastName?: string;

  @IsEmail()
  @ApiProperty({
    example: "ali@gmail.com",
    description: "The email of the user",
  })
  public readonly email: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: "123456",
    description: "The password of the user",
  })
  public readonly password?: string;

  @IsOptional()
  @IsEnum(["local", "google", "github"])
  public readonly provider?: Account["provider"];

  @IsOptional()
  public readonly providerId?: string;
}
