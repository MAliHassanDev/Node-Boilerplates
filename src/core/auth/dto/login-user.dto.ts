import { IsEmail, IsString } from "class-validator";

export class LoginInDto {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
