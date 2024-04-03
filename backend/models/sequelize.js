import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_URI, {
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  define: {
    freezeTableName: true,
    underscored: true,
  },
  logging: false
});

export default sequelize;
