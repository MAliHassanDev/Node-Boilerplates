import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SerializeOptions,
} from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { ApiTags } from "@nestjs/swagger";
import { ApiDocCreateUser } from "./docs/users.docs.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UserEntity } from "./entities/user.entity.js";
import type { Request } from "express";

@Controller("users")
@ApiTags("Users")
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  @SerializeOptions({ type: UserEntity })
  public async findAll(): Promise<UserEntity[]> {
    return this.usersService.findMany({});
  }

  @Post()
  @SerializeOptions({ type: UserEntity })
  @ApiDocCreateUser()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @Get("profile")
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
