import { SetMetadata } from '@nestjs/common';
import { AuthRoleType } from '@reus-able/types';

export const AuthRoles = (...roles: AuthRoleType[]) => SetMetadata('roles', roles);

export const PermissionGuard = (...permissions: string[]) => SetMetadata('permissions', permissions);
