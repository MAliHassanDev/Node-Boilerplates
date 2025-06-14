import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SerializeOptions,
} from "@nestjs/common";
import { AccountsService } from "./accounts.service.js";
import { ApiTags } from "@nestjs/swagger";
import { ApiDocCreateUser } from "./docs/accounts.docs.js";
import { CreateAccountDto } from "./dto/create-account.dto.js";
import type { Request } from "express";
import { UserAccountEntity } from "./entities/user-account.entity.js";

@Controller("users")
@ApiTags("Users")
export class UsersController {
  public constructor(private readonly usersService: AccountsService) {}

  @Get()
  @SerializeOptions({ type: UserAccountEntity })
  public async findAll(): Promise<UserAccountEntity[]> {
    return this.usersService.findMany({});
  }

  @Post()
  @SerializeOptions({ type: UserAccountEntity })
  @ApiDocCreateUser()
  public async create(
    @Body() createUserDto: CreateAccountDto,
  ): Promise<UserAccountEntity> {
    return this.usersService.create(createUserDto);
  }

  @Get("profile")
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
