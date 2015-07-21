import bcrypt from 'bcrypt';
import queryDb from '../queryDb';
import cache from './cache';
export default function validateJWT(decoded, request, callback) {
  console.log('validateJWT');
  console.log(decoded);
  cache.get(decoded.id, (err, result) => {
    let session;
    if (err) console.log(err);
    if (result) console.log(result);
    callback(err, false); // !
  });
}