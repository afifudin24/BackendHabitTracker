const db = require('./database');

const connect = db.sequelize.authenticate()
  .then(() => console.log('✅  MySQL connected!'))
  .catch(err => {
    console.error('❌  DB connection failed:', err);
    process.exit(1);                 // keluar bila koneksi gagal
  });

module.exports = connect
