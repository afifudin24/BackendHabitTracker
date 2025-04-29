// models/habit.js
/**
 * Model Habit – factory function format
 * Dipanggil otomatis oleh models/index.js:  module.exports(sequelize, DataTypes)
 */
module.exports = (sequelize, DataTypes) => {
  const Habit = sequelize.define('Habit', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    /* FK → users.id  */
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    description: DataTypes.TEXT,

    periodType: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
      allowNull: false,
      defaultValue: 'daily',
    },

    targetValue: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },

    colorHex: DataTypes.CHAR(7),        // #A1B2C3

    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'habits',
    timestamps: true,
  });

  /* ---------- RELASI ---------- */
  Habit.associate = models => {
    Habit.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Habit.hasMany(models.HabitLog, {
      foreignKey: 'habitId',
      as: 'logs',
      onDelete: 'CASCADE',
    });
  };

  return Habit;
};
