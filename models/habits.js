// models/habit.js
/**
 * Model Habit – factory function format
 * Dipanggil otomatis oleh models/index.js:  module.exports(sequelize, DataTypes)
 */
module.exports = (sequelize, DataTypes) => {
  const Habit = sequelize.define('Habit', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'ID is required' },
      },
    },

    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: 'User ID is required' },
        isInt: { msg: 'User ID must be a number' },
      },
    },

    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    periodType: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
      allowNull: false,
      defaultValue: 'daily',
      validate: {
        notEmpty: { msg: 'Period type is required' },
        isIn: {
          args: [['daily', 'weekly', 'monthly']],
          msg: 'Period type must be one of daily, weekly, or monthly',
        },
      },
    },

    targetValue: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: { msg: 'Target value must be a positive number' },
        min: {
          args: [1],
          msg: 'Target value must be at least 1',
        },
      },
    },

    colorHex: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Color is required' },
        is: {
          args: /^#([0-9A-F]{3}){1,2}$/i,
          msg: 'Invalid HEX color',
        },
      },
    },

    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'habits',
    timestamps: true,
  });

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
