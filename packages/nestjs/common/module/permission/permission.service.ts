import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PermissionService {
  abstract getPermissionByRole(role: string): Promise<string[]>;

  abstract getPermissionByRoles(roles: string[]): Promise<string[]>;
}
