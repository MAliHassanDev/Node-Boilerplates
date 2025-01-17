/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import dotenv from "dotenv";
import { join } from "path";
import logger from "./logger.js";

export type NodeEnv = "development" | "test" | "production";

dotenv.config({
  path: join(import.meta.dirname, "..", "..", ".env"),
});

type Env = string | number;

export interface ServerConfig {
  port: number;
  host: string;
}

export interface DatabaseConfig {
  connectionString: string;
  name: string;
}

export interface NodeConfig {
  env: NodeEnv;
}

interface Configs {
  server?: ServerConfig;
  database?: DatabaseConfig;
  node?: NodeConfig;
}

class Config {
  private readonly configs: Configs = {};
  private readonly env: NodeEnv;
  private static instance: Config;

  private constructor() {
    this.env = this.getEnv<NodeEnv>("NODE_ENV", "development", [
      "development",
      "test",
      "production",
    ]);
  }

  private initializeConfig(name: keyof Configs) {
    switch (name) {
      case "server":
        this.configs[name] = {
          port: this.getEnv("PORT", 3000),
          host: this.getEnv("HOST", "127.0.0.1"),
        };
        break;

      case "database":
        this.configs[name] = {
          name: this.getEnv("DATABASE_NAME", "myDb"),
          connectionString: this.getEnv(
            "DATABASE_URI",
            "mongodb://localhost:27017",
          ),
        };
        break;

      case "node":
        this.configs[name] = {
          env: this.env,
        };
    }
  }

  public get<K extends keyof Configs>(name: K) {
    if (!this.configs[name]) {
      this.initializeConfig(name);
    }

    if (!this.configs[name]) {
      throw new Error(`${name} config is not defined`);
    }

    return this.configs[name];
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private getEnv<T extends Env>(
    name: string,
    defaultValue: T,
    expectedValues?: Env[],
  ): T {
    const value =
      process.env[`${name}_${(this.env ?? "development").toUpperCase()}`] ??
      process.env[name];

    if (!value) {
      logger.warn(
        `Env '${name}' not defined. Using default value '${defaultValue}'`,
        "Config",
      );
      return defaultValue;
    }
    // use default if env value is not one of the expected values
    if (expectedValues) {
      const isValueInExpected = expectedValues.some(
        expectedValue => expectedValue === value,
      );
      if (!isValueInExpected) {
        logger.warn(
          `Value of Env '${name}=${value}' is different from the expected values '${expectedValues.toString()}'.Using Default value '${defaultValue}'`,
          "Config",
        );
        return defaultValue;
      }
    }

    return typeof defaultValue === "number"
      ? (parseInt(value, 10) as T)
      : (value as T);
  }
}

export default Config.getInstance();
