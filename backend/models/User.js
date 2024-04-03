import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

import sequelize from './sequelize.js';
import Organization from './Organization.js';
import Role from './Role.js';

const User = sequelize.define(
  'user',
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // TODO: createdBy field (one-to-many relationship on the same table[User(1)-User(Many)])
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

User.hasMany(User, {
  foreignKey: {
    name: 'createdBy',
  },
});
User.belongsTo(User, {
  foreignKey: {
    name: 'createdBy',
  },
});

Role.belongsToMany(User, {
  through: 'user_role',
  foreignKey: 'role',
});
User.belongsToMany(Role, {
  through: 'user_role',
  targetKey: 'code',
});

User.prototype.hashPassword = async function () {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
};

User.prototype.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.beforeCreate(async (user) => {
  await user.hashPassword();
});

export default User;
