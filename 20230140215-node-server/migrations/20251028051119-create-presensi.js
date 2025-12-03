'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Presensis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Pastikan nama tabel users kamu 'Users'
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      checkIn: {
        type: Sequelize.DATE,
        allowNull: false
      },
      checkOut: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // --- PASTIIN BAGIAN INI ADA & FILE SUDAH DI-SAVE ---
      latitude_in: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude_in: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      latitude_out: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude_out: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      // --------------------------------------------------
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Presensis');
  }
};