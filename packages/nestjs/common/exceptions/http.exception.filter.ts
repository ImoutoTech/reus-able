import type { FastifyReply } from 'fastify';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { BusinessException } from './business.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      response
        .status(error['httpCode'] || HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          code: error['code'],
          msg: error['message'],
          data: null,
        });
      return;
    }

    response.status(status).send({
      code: status,
      msg: 'HTTP Error',
      data: exception.getResponse(),
    });
  }
}
