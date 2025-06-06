import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env.schema.js";

@Injectable()
export class EnvService {
  public constructor(
    private readonly configService: ConfigService<Env, true>,
  ) {}

  public get<K extends keyof Env>(key: K) {
    return this.configService.get(key, { infer: true });
  }
}
