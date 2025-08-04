import { SetMetadata, BadRequestException } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export function Roles(...roles: string[]) {
  if (!roles || roles.length === 0) {
    throw new BadRequestException('@Roles() must specify at least one role');
  }
  return SetMetadata(ROLES_KEY, roles);
}
