## possible states of users trying to login

- no account
- created account, not verified, no token sent from login
- created account, not verified, token sent from login
- created account, verified
- created, not verified, no token in db (might have expired)

## login flow

{email, password, token?}

- look for user with email in db
  - if no user with email in db, report 'Invalid email or password' ❌
- verify user password
  - if wrong password, report 'Invalid email or password' ❌
- check if verified
  - if not verified check for token from frontend
    - if no token, report 'This account requires verification. Check your email' with resend interface/link/button ❌
  - check for token in db
    - if no token, create token and send email and inform the user to check email ❌
  - verify token (eg check for expiry)
    - if not valid token(eg token is expired) -> currently not possible because token won't be expiring (for now)
  - mark user as verified and delete token from db
  - login user ✅
- log in user ✅

## login flow

{email, password, token?}

1. look for user with email in db
   1.1 if user exists: verify user password
   1.1.1 if password correct: check if verified - if user is verified: log in user - if not verified: check for token from frontend - if token from frontend is given: check for token in db - if token in db: verify token (token must belong to the user who tried to login) - if token in db valid: mark user as verified and delete token from db - login user - if token in db not valid: (eg token is expired) -> currently not possible because token won't be expiring (for now) - if no token in db: create token and send email - if no token from front end is given: report 'This account requires verification. Check your email' with resend interface/link/button
   1.1.2- if wrong password, report 'Invalid email or password'
   1.2 if user does not exist, report 'Invalid email or password'
