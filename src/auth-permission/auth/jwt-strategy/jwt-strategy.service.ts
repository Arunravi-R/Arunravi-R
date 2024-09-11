import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ValUser } from 'src/core/variables/interfaces';
import { Request } from 'express';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRETKEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: ValUser) {
    // try {
      // if (req.headers.sessionid == req.session.id) {
        return payload;
      // }
      // throw new UnauthorizedException();
    // } catch (err) {
    //   return false;
    // }
  }
}
