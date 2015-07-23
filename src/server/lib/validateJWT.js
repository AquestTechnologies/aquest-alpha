export default function validateJWT(decoded, request, callback) {
  console.log('validateJWT');
  console.log('decoded', decoded);
  callback(null, decoded.valid);
}