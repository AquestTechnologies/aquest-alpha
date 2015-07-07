// DLM !!!!
// DLGM !!!
// Mais Immutable...
export default function simpleCopy(obj) {
  
  // let d = new Date()

  let copy = {};
  
  for(let key in obj) {
    copy[key] = obj[key];
  }

  // console.log('... simpleCopy exiting after ' + (new Date() - d) + 'ms.');

  return copy;
}