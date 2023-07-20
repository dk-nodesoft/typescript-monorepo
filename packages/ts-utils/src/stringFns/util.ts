import { forEach } from 'lodash';

export const toParameterString = (params: object): string => {
  let urlParams = '';
  forEach(params, (value, name) => {
    urlParams += `${urlParams ? '&' : ''}${name}=${value}`;
  });
  return urlParams;
};
