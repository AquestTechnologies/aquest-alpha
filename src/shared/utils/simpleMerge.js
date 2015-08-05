export default function simpleMerge(a, b) {
  Object.keys(b).forEach(key => b.hasOwnProperty(key) ? a[key] = b[key] : {});
  return a;
}