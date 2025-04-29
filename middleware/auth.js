// middleware/auth.js
const { attachUserFromHeader } = require('../utils');

module.exports = (req, res, next) => {
  // coba pasang user
  attachUserFromHeader(req);

  if (req.user) {
    return next();                 // user ada → lanjut ke route berikutnya
  }

  return res.status(401).json({ message: 'Unauthorized' });
};
