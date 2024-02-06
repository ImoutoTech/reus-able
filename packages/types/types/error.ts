import { HttpStatus } from '@nestjs/common';

export type BusinessError = {
  code: number;
  message: string;
  httpCode?: HttpStatus;
};