import { Inject } from "@nestjs/common";
import { DRIZZLE_CONNECTION_TOKEN } from "./drizzle.constants.js";

export const InjectDrizzle = () => Inject(DRIZZLE_CONNECTION_TOKEN);
