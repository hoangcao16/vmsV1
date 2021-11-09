export default function trimObjValues(obj) {
  const trimData =  Object.keys(obj).reduce((acc, curr) => {
    acc[curr] = obj[curr].trim();
    return acc;
  }, {});


  return trimData;
}
