import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";

export const InjectCacheManager = () => {
  return Inject(CACHE_MANAGER);
};
