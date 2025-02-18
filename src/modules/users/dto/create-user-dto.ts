/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class RegisterUserDto {
  @IsString()
  public readonly firstName: string;

  @IsOptional()
  @IsString()
  public readonly lastName: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;

  @IsEnum(["male", "female", "other"], {
    message: "Gender must male, female or other",
  })
  public readonly gender: "male" | "female" | "other";

  @IsEnum(["admin", "influencer", "user"])
  @IsOptional()
  public readonly role: "admin" | "influencer" | "user";
}
