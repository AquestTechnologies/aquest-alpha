export function copy(a) {
  const o = {};
  for (let k in a) {
    if (a.hasOwnProperty(k)) {
      o[k] = a[k];
    }
  }
  return o;
}

export function deepCopy(a) {
  const o = {};
  for (let k in a) {
    if (a.hasOwnProperty(k)) {
      const val = a[k];
      if (val instanceof Array) {
        o[k] = [];
        val.forEach(item => o[k].push(deepCopy(item)));
      }
      else if (typeof val === 'object' && !(val instanceof Date)) o[k] = deepCopy(val);
      else o[k] = val;
    }
  }
  return o;
}

export function merge(t, s) {
  for (let k in s) {
    if (s.hasOwnProperty(k)) {
      t[k] = s[k];
    }
  }
  return t;
}

export function fuse(a, b) {
  const o = {};
  for (let k in a) {
    if (a.hasOwnProperty(k)) o[k] = a[k];
  }
  for (let k in b) {
    if (b.hasOwnProperty(k)) o[k] = b[k];
  }
  return o;
}
