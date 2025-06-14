import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateAccountDto {
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "123456",
    description: "The password of the user",
  })
  public readonly password: string;
}
