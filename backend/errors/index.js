class ApiError extends Error {
  constructor({ message, errorCode, statusCode }) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      message: this.message,
      ...this,
    };
  }
}

class InvalidVerificationTokenError extends ApiError {
  constructor() {
    super({
      message: 'The verification token is invalid',
      errorCode: 'auth/invalid-verification-token',
      statusCode: 403,
    });
  }
}

class AuthorizationFailedError extends ApiError {
  constructor() {
    super({
      message: 'Incorrect email or password',
      errorCode: 'auth/invalid-credentials',
      statusCode: 400,
    });
  }
}

class UnauthorizedAccessError extends ApiError {
  constructor() {
    super({
      message: 'This resource requires a logged in user',
      errorCode: 'auth/unauthorized-access',
      statusCode: 401,
    });
  }
}
class DuplicateBranchName extends ApiError {
  constructor() {
    super({
      message: 'Branch name already exists',
      errorCode: 'branch-already-exists',
      statusCode: 401,
    });
  }
}
class DuplicateEmail extends ApiError {
  constructor() {
    super({
      message: 'Email already exists',
      errorCode: 'email-already-exists',
      statusCode: 401,
    });
  }
}
class DuplicateGrainTypeError extends ApiError {
  constructor() {
    super({
      message: 'Grain type already exists',
      errorCode: 'grain-type-already-exists',
      statusCode: 401,
    });
  }
}

class NoSiloInventoryError extends ApiError {
  constructor() {
    super({
      message: 'There is currently no silo inventory for this grain type',
      errorCode: 'no-silo-inventory',
      statusCode: 400,
    });
  }
}

class InsufficientSiloInventoryError extends ApiError {
  constructor() {
    super({
      message: 'Insufficient silo inventory for this grain type',
      errorCode: 'insufficient-silo-inventory',
      statusCode: 400,
    });
  }
}

class DuplicateBatchNumberError extends ApiError {
  constructor() {
    super({
      message: 'This batch number is already in use',
      errorCode: 'duplicate-batch-number',
      statusCode: 400,
    });
  }
}

class InvalidBatchNumberError extends ApiError {
  constructor() {
    super({
      message: 'This batch number is invalid',
      errorCode: 'invalid-batch-number',
      statusCode: 400,
    });
  }
}

class InvalidStackNumberError extends ApiError {
  constructor() {
    super({
      message: 'This stack number is invalid',
      errorCode: 'invalid-stack-number',
      statusCode: 400,
    });
  }
}
class DuplicateStartDate extends ApiError {
  constructor() {
    super({
      message:
        'This stack number has already been scheduled for this start date',
      errorCode: 'duplicate-start-date-for-stack-number',
      statusCode: 400,
    });
  }
}

class InvalidOrderError extends ApiError {
  constructor() {
    super({
      message:
        'Order either does not exist or is not a pending order',
      errorCode: 'invalid-order',
      statusCode: 400,
    });
  }
}

class InvalidatedPickingPlanError extends ApiError {
  constructor() {
    super({
      message:
        'At least one stack has undergone changes. The picking plan needs to be regenerated.=',
      errorCode: 'invalidated-picking-plan',
      statusCode: 400,
    });
  }
}

class OrderCannotBeSatisfiedError extends ApiError {
  constructor(pickingPlan) {
    super({
      message:
        'Order cannot be satisfied',
      errorCode: 'order-cannot-be-satisfied',
      statusCode: 400,
    });
    this.pickingPlan = pickingPlan;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...this
    }
  }
}

export {
  ApiError,
  InvalidVerificationTokenError,
  AuthorizationFailedError,
  UnauthorizedAccessError,
  DuplicateBranchName,
  DuplicateEmail,
  DuplicateGrainTypeError,
  NoSiloInventoryError,
  InsufficientSiloInventoryError,
  DuplicateBatchNumberError,
  InvalidBatchNumberError,
  InvalidStackNumberError,
  DuplicateStartDate,
  InvalidOrderError,
  OrderCannotBeSatisfiedError,
  InvalidatedPickingPlanError
};
