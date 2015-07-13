// DLM !!!!
// DLGM !!!
// Mais Immutable...
export default function simpleCopy(obj) {
  const copy = {};
  for (const key in obj) {
    copy[key] = obj[key];
  }

  return copy;
}
