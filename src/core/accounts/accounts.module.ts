import { Module } from "@nestjs/common";
import { AccountsService } from "./accounts.service.js";
import { UsersController } from "./accounts.controller.js";

@Module({
  providers: [AccountsService],
  controllers: [UsersController],
  exports: [AccountsService],
})
export class UsersModule {}
