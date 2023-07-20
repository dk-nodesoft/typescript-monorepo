import { forEach, isString } from 'lodash';
import type { RoleString, SystemRole } from './role.type';

export const SYSTEM_ROLE_TENANTGUEST: SystemRole = 'guest';
export const SYSTEM_ROLE_TENANTUSER: SystemRole = 'user';
export const SYSTEM_ROLE_TENANTADMIN: SystemRole = 'admin';
export const SYSTEM_ROLE_SYSTEM: SystemRole = 'systemadmin';

export const SYSTEM_GROUP_TENANTGUEST = SYSTEM_ROLE_TENANTGUEST;
export const SYSTEM_GROUP_TENANTUSER = SYSTEM_ROLE_TENANTUSER;
export const SYSTEM_GROUP_TENANTADMIN = SYSTEM_ROLE_TENANTADMIN;
export const SYSTEM_GROUP_SYSTEM = SYSTEM_ROLE_SYSTEM;

const systemRoles: RoleString[] = [
  SYSTEM_ROLE_TENANTGUEST,
  SYSTEM_ROLE_TENANTUSER,
  SYSTEM_ROLE_TENANTADMIN,
  SYSTEM_ROLE_SYSTEM
];

export const hasRole = (roles: RoleString[], role: RoleString): boolean => roles.indexOf(role) !== -1;
export const isSystemRole = (role: unknown): role is SystemRole => isString(role) && systemRoles.indexOf(role) !== -1;
export const isUserRole = isSystemRole;

export const validateRoles = (userroles: RoleString[], roles: RoleString[] | undefined): boolean => {
  if (!roles || roles.length === 0) {
    return true;
  }

  let valid = false;

  forEach(roles, (role: RoleString) => {
    if (hasRole(userroles, role)) {
      valid = true;
      return false;
    }
  });

  return valid;
};
