export const createTestTenantString = (str = 'tenant'): string => `${str}_${Math.random().toString(36).slice(2)}`;
