// models/user.js
/**
 * Model User – factory function format
 * Dipanggil otomatis oleh models/index.js:  module.exports(sequelize, DataTypes)
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordString: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
  }, {
    tableName: 'users',              // nama tabel MySQL
    timestamps: true,                // createdAt & updatedAt otomatis
    underscored: false,              // pakai camelCase di kolom model
  });

  return User;
};
