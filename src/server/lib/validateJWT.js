const authenticationList = {
  "/api/universes/": true,
  "/api/universe/": true,
  "/api/inventory/": true,
  "/api/topic/": false,
  "/api/topic/content/": false,
  "/api/chat/": false
}

export default function validateJWT(decoded, request, callback) {
  console.log('validateJWT');
  console.log('decoded', decoded);
  callback(null, decoded.valid);
}