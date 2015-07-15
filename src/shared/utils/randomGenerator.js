export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomString(l) {
  let text = '';
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < l; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return text;
}

export function randomText(l) {
	let text = randomString(l);
	const n = Math.floor(l / 6);
	
	for (let i = 0; i < n; i++) {
		const index = randomInteger(0, l-1);
		text = text.substr(0, index) + ' ' + text.substr(index + 1);
	}
	
	return text;
}