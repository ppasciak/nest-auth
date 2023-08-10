import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new ForbiddenException('Missing token');
    }
    const token = authorization.split(' ')[1];

    try {
      const authData = jwt.verify(token, process.env.JWT_TOKEN) as {
        email: string;
      };
      req['user'] = authData.email;
      next();
    } catch (err) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
