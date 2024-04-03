import { DataTypes } from 'sequelize';
import crypto from 'crypto';

import sequelize from './sequelize.js';
import User from './User.js';

const VerificationToken = sequelize.define(
  'verificationToken',
  {
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      defaultValue: () => crypto.randomBytes(32).toString('hex'),
    },
  },
  {
    tableName: 'verification_token',
  }
);

User.hasOne(VerificationToken, { foreignKey: { allowNull: false } });
VerificationToken.belongsTo(User);

export default VerificationToken;
