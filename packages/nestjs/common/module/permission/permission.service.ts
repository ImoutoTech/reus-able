import { Injectable } from '@nestjs/common';

export const PERMISSION_SERVICE_TOKEN = Symbol('PERMISSION_SERVICE_TOKEN');

@Injectable()
export abstract class PermissionService {
  abstract getPermissionByRole(role: string): Promise<string[]>;

  abstract getPermissionByRoles(roles: string[]): Promise<string[]>;
}
