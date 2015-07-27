export default function validateJWT(decoded, request, callback) {
  console.log('jwt', decoded.id);
  callback(null, decoded.valid);
}