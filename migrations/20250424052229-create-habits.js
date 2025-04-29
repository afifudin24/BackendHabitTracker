'use strict';

module.exports = {
  /** Jalankan saat `npx sequelize-cli db:migrate` */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('habits', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {                              // FK → users.id
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      periodType: {                         // daily / weekly / monthly
        type: Sequelize.ENUM('daily', 'weekly', 'monthly'),
        allowNull: false,
        defaultValue: 'daily',
      },
      targetValue: {                        // berapa kali target tercapai
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      colorHex: {                           // untuk tampilan UI
        type: Sequelize.CHAR(7),            // contoh: #A1B2C3
        allowNull: true,
      },
      archived: {                           // soft‑delete logika bisnis
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    /* OPTIONAL: index gabungan agar query userId & archived lebih cepat */
    await queryInterface.addIndex('habits', ['userId', 'archived']);
  },

  /** Jalankan saat `npx sequelize-cli db:migrate:undo` */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('habits');
  },
};
