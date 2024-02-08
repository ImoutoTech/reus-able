import { SetMetadata } from '@nestjs/common';
import { AuthRoleType } from '@reus-able/types';

export const AuthRoles = (...roles: AuthRoleType[]) => SetMetadata('roles', roles);
