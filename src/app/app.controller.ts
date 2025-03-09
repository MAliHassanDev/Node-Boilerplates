import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service.js";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags("App")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
