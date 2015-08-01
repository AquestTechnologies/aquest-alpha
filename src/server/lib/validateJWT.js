export default function validateJWT(decoded, request, callback) {
  console.log('jwt', decoded.userId);
  callback(null, decoded.valid);
}