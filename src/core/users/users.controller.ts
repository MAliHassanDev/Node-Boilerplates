import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { ApiTags } from "@nestjs/swagger";
import { ApiDocCreateUser } from "./docs/users.docs.js";

@Controller("users")
@ApiTags("Users")
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiDocCreateUser()
  public async findAll() {
    return this.usersService.findMany({});
  }
}
