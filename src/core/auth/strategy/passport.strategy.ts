import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "../constants/auth.constants.js";
import { AuthTokenPayload } from "../types/auth.type.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessToken.secret,
    });
  }

  validate(payload: AuthTokenPayload) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
