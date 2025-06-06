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

  @IsEnum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender must male, female or other",
  })
  public readonly gender: "male" | "female" | "other";
}
