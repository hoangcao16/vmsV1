export default function clearData(obj) {
  const propNames = Object.getOwnPropertyNames(obj);

  for (let i = 0; i < propNames.length; i += 1) {
    const propName = propNames[i];
    if (
      obj[propName] === undefined ||
      obj[propName] === '' ||
      obj[propName] === null
    ) {
      delete obj[propName];
    }
  }
  return obj;
}

