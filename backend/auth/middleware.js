import { UnauthorizedAccessError } from '../errors/index.js';

const ensureLoggedIn = () => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next(new UnauthorizedAccessError());
    }
    next();
  };
};

export { ensureLoggedIn };
