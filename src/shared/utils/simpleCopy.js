// DLM !!!!
// DLGM !!!
// Mais Immutable...
export default function simpleCopy(obj) {
  const copy = {};
  for (let key in obj) {
    copy[key] = obj[key];
  }

  return copy;
}
