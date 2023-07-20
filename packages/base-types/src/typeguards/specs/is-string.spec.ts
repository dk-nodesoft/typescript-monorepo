import { forEach } from '@dk-nodesoft/ts-utils';
import { isEmailString, isLanguageString, isLocaleString, isPasswordString, isTenantString } from '../string';

describe('util/is-string.ts', () => {
  it('should be defined', () => {
    expect(isTenantString).toBeDefined();
    expect(isLocaleString).toBeDefined();
    expect(isLanguageString).toBeDefined();
    expect(isEmailString).toBeDefined();
    expect(isPasswordString).toBeDefined();
  });

  it('should validate TenantString', () => {
    const validTenantStrings: string[] = [
      'TENANT',
      '_TENANT',
      'TENANT_',
      '_TENANT_TENANT_',
      '123tenant_',
      '_123TENANT'
    ];
    forEach(validTenantStrings, (tenant) => {
      expect(`${tenant} - ${isTenantString(tenant)}`).toBe(`${tenant} - true`);
    });
  });
});
