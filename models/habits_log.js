// models/habitLog.js
module.exports = (sequelize, DataTypes) => {
  const HabitLog = sequelize.define(
    'HabitLog',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      habitId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'habit_logs', // pastikan nama tabel sesuai dengan tabel di database
      timestamps: true,
    },
  );

  HabitLog.associate = (models) => {
    HabitLog.belongsTo(models.Habit, {
      foreignKey: 'habitId',
      onDelete: 'CASCADE',
    });
  };

  return HabitLog;
};
