import bcrypt from 'bcrypt';
import queryDb from '../queryDb';
import cache from './cache';

export default function validateJWT(decoded, request, callback) {
  console.log('validateJWT');
  console.log('decoded', decoded);
  callback(null, decoded.valid);
}