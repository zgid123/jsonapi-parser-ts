const isObject = (data: any): data is object => {
  return typeof data === 'object' && data !== null;
};

export default isObject;
