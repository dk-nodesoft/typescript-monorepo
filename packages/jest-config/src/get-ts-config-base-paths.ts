import { getTsconfig } from 'get-tsconfig';
import { pathsToModuleNameMapper } from 'ts-jest';

/**
 * Transform the tsconfig paths into jest compatible one (support extends)
 * @param tsConfigFile - configuration file
 */
export const getTsConfigBasePaths = (tsConfigFile: string): { [key: string]: string | string[] } | undefined => {
  const parsedTsConfig = getTsconfig(tsConfigFile);
  if (parsedTsConfig === null) {
    throw new Error(`Cannot find tsconfig file: ${tsConfigFile}`);
  }
  const tsPaths = parsedTsConfig.config.compilerOptions?.paths;
  return tsPaths
    ? pathsToModuleNameMapper(tsPaths, {
        prefix: '<rootDir>/'
      })
    : {};
};
