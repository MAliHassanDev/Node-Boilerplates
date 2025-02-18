import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service.js";

@Injectable()
export class AuthService {
  public constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
