import * as pjson from '../../package.json';

const packageName = pjson.name;

describe(`${packageName}`, () => {
  it('should be defined', () => {
    expect(packageName).toBeDefined();
  });
});
