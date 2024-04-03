## Features

- [ ] Creating a company account
- [ ] Send verification email to admin(with link to create password)
- [ ] Admin login
- [ ] Create warehouse
- [ ] Create non-admin users
- [ ] Send emails to non-admin users (with link to create password)
- [ ] Non-admin users create password
- [ ] Non-admin users login
- [ ] Non-admin users get to work(receiving, quality)

## Tools

- frontend

  - react-hook-form
  - yup
  - axios (/signup, /login)
  - react-query

- passport
- sequelize

## Tasks for 8th June

- [x] Create Models required for tasks below (User, Organization and Role)
- [x] Insert predefined roles into the role table
- [x] Change sign up form to create organization form that captures both organization details and user admin details
- [x] Modify '/signup' API POST endpoint to split the form data into the User data and Organization data before inserting it into the respective tables. (/signup changed to /create-organization)
- [x] Assign the created User an ADMIN Role in the UserRole joint/intermediary table (between User and Role)
- [x] Wrapping the account creation db logic in a sequelize transaction
- [x] Hashing the user password before inserting into the table
<!-- - [ ] Add passportjs to sign up (organization account creation) logic for the admin account??????????? -->
- [1/2] Email verification?????????? (when should this happen, when they login, or just after they successfully create an account)
- [x] Redirect admin user to the login page after successful account creation
- [x] Add passportjs to login logic
- [ ] Redirect admin user to the dashboard page after successful login and email verification
- [ ] Provide a warehouse creation interface on the Admin dashboard
- [ ] Provide a user(warehouse user) creation interface

## Monday

- Put the weigh bridge data together with received produce
  - not the case, shared model is to be created for first mass measurement and commodity receipt form
- Create interface to add grain types into the system (for receiving officer)
  - DONE
- modify receive produce form with a dropdown for grain types
  - DONE
- decide the actual columns that appear in the tables so we can create endpoints returning the right data to be displayed in the tables
  - Non issue, we can decide at the time of writing the code

## Monday night

- statuses for tracking which processes a "lot" has been through (eg, received, weighed, assessed)
  - DONE
- add a status column to ReceivedProduct for tracking ~~quality assessment~~ err'thing
  - DONE, same as above
- implement weigh bridge form, model and backend endpoint
- create relationship between QAData and ReceivedProduct via the lotId of the ReceivedProduct
- consider a ui for reporting captured data
- consider a ui and model for silo inventory (as well as which role gets this interface)
- add column visibility to tables
- add table filter/search
- remove organizationId from interface and model
- export/download table, form data etc
- ***
- Fauzia's requirement loophole aka THE THING\*❓❓❓
- ***

- Make empty strings in QA form be considered as NULL, not 0 (zero) ✅
- when adding silo inventory, check if silo entry exists and if not create an entry with an initial value of the quantity being added. otherwise add(append) the quantity to the existing entry ✅
