// utils/index.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Mendapatkan user dari Authorization header.
 * Jika token valid → mengembalikan objek user (payload JWT).
 * Jika tidak ada / tidak valid → null.
 */
exports.attachUserFromHeader = (req) => {
  const auth = req.headers.authorization || '';        // "Bearer <token>"
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY); // verifikasi
    req.user = payload;                                        // simpan di req
    return payload;
  } catch (err) {
    return null; // token rusak / kedaluwarsa
  }
};
