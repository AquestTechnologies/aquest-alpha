export default function isClient() {
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    return true;
  } else {
    return false;
  }
}
