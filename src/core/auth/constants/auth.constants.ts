export const jwtConstants = {
  refreshToken: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET ?? "superscretrefresh",
    expireTimeInSec:
      Number(process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME_IN_SEC) || 60 * 60 * 12, // 12 hours,
  },
  accessToken: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET ?? "supersecretaccess",
    expireTimeInSec:
      Number(process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME_IN_SEC) || 60 * 15, // 15 minutes,
  },
};
