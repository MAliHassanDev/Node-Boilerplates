import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    example: "Muhammad",
    description: "The first name of the user",
  })
  public readonly firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "Ali", description: "The last name of the user" })
  public readonly lastName: string;

  @IsEmail()
  @ApiProperty({
    example: "ali@gmail.com",
    description: "The email of the user",
  })
  public readonly email: string;

  @IsString()
  @ApiProperty({
    example: "123456",
    description: "The password of the user",
  })
  public readonly password: string;

  @IsEnum(["MALE", "FEMALE", "OTHER"], {
    message: "Gender must male, female or other",
  })
  @ApiProperty({
    example: "MALE",
    description: "The gender of the user",
  })
  public readonly gender: "male" | "female" | "other";
}
