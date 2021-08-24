import isDate from './isDate';
import isObject from './isObject';

export const camelize = (str: string): string => {
  return str?.replace(/^([A-Z])|[\s-_/]+(\w)/g, (_match, p1, p2) => {
    if (p2) {
      return p2.toUpperCase();
    }

    return p1.toLowerCase();
  });
};

export const camelizeKeys = (data: any): any => {
  if (!isObject(data) || isDate(data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((datumn) => {
      return camelizeKeys(datumn);
    });
  }

  return Object.entries(data).reduce((result, [k, v]) => {
    let value;

    if (!isObject(v) || isDate(v)) {
      value = v;
    } else {
      value = camelizeKeys(v);
    }

    Object.assign(result, {
      [camelize(k)]: value,
    });

    return result;
  }, {});
};
