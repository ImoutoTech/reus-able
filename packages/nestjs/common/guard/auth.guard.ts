import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { BUSINESS_ERROR_CODE } from '@reus-able/const';
import * as jwt from 'jsonwebtoken';
import { BusinessException } from '../exceptions';
import { HLOGGER_TOKEN, HLogger } from '../module/logger';
import { Reflector } from '@nestjs/core';
import { UserJwtPayload, UserRole } from '@reus-able/types';
import { PERMISSION_SERVICE_TOKEN, PermissionService } from '@/common/module';

const parseHeaderToken = (request: FastifyRequest, logger: HLogger): string => {
  const authorization = request.headers.authorization || '';

  const bearer = authorization.split(' ');

  if (!bearer || bearer.length < 2) {
    logger.warn(`出现无token请求${request.url}`);
    BusinessException.emptyToken();
  }

  return bearer[1];
};

const handleAuthError = (
  e: Error,
  logger: HLogger,
  request: FastifyRequest,
) => {
  if (e instanceof jwt.TokenExpiredError) {
    logger.warn(`过期token请求${request.url}`, 'AuthGuard');
    BusinessException.throw(
      BUSINESS_ERROR_CODE.EXPIRED_TOKEN,
      'token 已经过期',
      HttpStatus.UNAUTHORIZED,
    );
  }

  logger.warn(`错误token请求${request.url}`, 'AuthGuard');
  BusinessException.throw(BUSINESS_ERROR_CODE.INVALID_TOKEN, 'token错误');
};

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(ConfigService)
  private config: ConfigService;

  @Inject(PERMISSION_SERVICE_TOKEN)
  private permissionService: PermissionService;

  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ) {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if ((!requiredRoles || !requiredRoles.length) && (!requiredPermissions || !requiredPermissions.length)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = parseHeaderToken(request, this.logger);

    try {
      const info = jwt.verify(
        token,
        this.config.get<string>('TOKEN_SECRET', ''),
      ) as UserJwtPayload;

      // 检查 token 类型
      if (info.refresh && !requiredRoles.includes('refresh')) {
        this.logger.warn(`用户#${info.id}错误使用refresh token`);
        BusinessException.throw(BUSINESS_ERROR_CODE.INVALID_TOKEN, 'token错误');
      }

      if (!info.refresh && requiredRoles.includes('refresh')) {
        this.logger.warn(`用户#${info.id}没有使用refresh token`);
        BusinessException.throw(BUSINESS_ERROR_CODE.INVALID_TOKEN, 'token错误');
      }

      // 当用户不是管理员时，检查角色和权限
      if (info.role !== UserRole.ADMIN) {
        // 检查权限
        if (requiredPermissions.length > 0) {
          const permissions = await this.permissionService.getPermissionByRoles(info.roles);
          const hasPermission = requiredPermissions.some(permission => permissions.includes(permission));
          if (!hasPermission) {
            this.logger.warn(`用户#${info.id}没有权限访问${requiredPermissions}`);
            BusinessException.throwForbidden();
          }
        }

        if (requiredRoles.includes('admin')) {
          this.logger.warn(`用户#${info.id}尝试访问admin权限接口`);
          BusinessException.throwForbidden();
        }
      }

      request.user = info;
      return true;
    } catch (e) {
      handleAuthError(e, this.logger, request);
    }
  }
}
