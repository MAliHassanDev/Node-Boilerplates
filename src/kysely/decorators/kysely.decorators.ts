import { Inject } from "@nestjs/common";
import { KYSELY_MODULE_CONNECTION_TOKEN } from "../constants/kysely.constants.js";

export const InjectKysely = () => Inject(KYSELY_MODULE_CONNECTION_TOKEN);
