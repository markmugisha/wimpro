import { AuthorizationFailedError } from '../errors/index.js';
import { Role, User } from '../models/index.js';

// done(null, false) - verification fails
// done (err) - an error occurred
// done(null, user) - verification success

const localStrategyHandler = async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: {
            exclude: ['id', 'type', 'name', 'createdAt', 'updatedAt'],
          },
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return done(new AuthorizationFailedError());
    }

    if (!(await user.verifyPassword(password))) {
      return done(new AuthorizationFailedError());
    }

    const userData = user.toJSON();
    delete userData.password;

    return done(null, userData);
  } catch (error) {
    return done(error);
  }
};

const serializeUser = (user, done) => {
  done(null, user.id);
};

const deserializeUser = async (id, done) => {
  try {
    const user = await User.findByPk(id, { include: Role });

    if (!user) {
      return done(null, false);
    }

    const userData = user.toJSON();
    delete userData.password;

    return done(null, userData);
  } catch (error) {
    return done(error);
  }
};

export { localStrategyHandler, serializeUser, deserializeUser };
