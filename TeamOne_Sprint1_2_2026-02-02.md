# Team One - Sprint 1 Planning Meeting

**Date:** February 2, 2026  
**Sprint:** Sprint 1  
**Duration:** 2 hours  
**Meeting Type:** Sprint Planning


## Attendees
- Anish Mehra
- Ghassan Naja
- Ryan Helou 
- Angad Malhotra 
- Dani Elbazzi 


## Meeting Agenda
1. Review project requirements for MealMajor application
2. Break down user stories into tasks
3. Assign story points and priorities
4. Distribute tasks among team members
5. Set sprint deadline and deliverables


## Sprint Goal
Implement core user authentication and profile management functionality for the MealMajor application, including user registration, login/logout, session management, and profile viewing/editing capabilities.


## User Stories & Tasks

### Story #1: User Registration
**As a new user, I want to create an account by entering name and password so I can use MealMajor.**

**Tasks:**
- Create a registration form: username, password, retype password
- Confirm user isn't already registered
- Make sure the chosen password is strong
- Send form to server to save the user info

**Story Points:** 3  
**Priority:** High  
**Risk:** Medium  
**Due Date:** February 6, 2026  
**Assigned to:** Anish Mehra, Ryan Helou


### Story #2: User Login with Error Handling
**As a user, I want to be able to sign in so that I can access my personal data. This includes error handling.**

**Tasks:**
- Create a login screen, with 2 text boxes for username and password, a "login" button and a "sign up" button
- Send login info to the server to authenticate the user (check correct username and password)
- Indicate the user if login was unsuccessful, and load home page if successful
- Indicate if the given username doesn't exist or if the password is incorrect
- Add a forgot password button (does nothing for now)

**Story Points:** 4  
**Priority:** High  
**Risk:** High  
**Due Date:** February 6, 2026  
**Assigned to:** Anish Mehra, Ryan Helou


### Story #3: Session Persistence
**As a user, I want my session to persist during use so I don't have to re-login each page.**

**Tasks:**
- After successful login, keep track of the user in the current session
- Design a home page with a button to log out, and another that leads to the account config page
- Make sure information on the user can easily be retrieved at any time

**Story Points:** 4  
**Priority:** High  
**Risk:** Medium  
**Due Date:** February 6, 2026  
**Assigned to:** Ghassan Naja


### Story #4: User Logout
**As a user, I want a way to log out so I can end my session.**

**Tasks:**
- Add a logout button that send the user back to the login page and clears their session
- Make sure all user data is saved to the database before the session ends

**Story Points:** 4  
**Priority:** High  
**Risk:** Medium  
**Due Date:** February 6, 2026  
**Assigned to:** Ghassan Naja, Ryan Helou


### Story #5: Profile Viewing
**As a user, I want to view my profile (name, email, allergies, preferences) so I can confirm my info.**

**Tasks:**
- Create an account config page with a form for users to fill out their information (allergies, etc...)
- POST the form to the server and update the information on the database

**Story Points:** 3  
**Priority:** High  
**Risk:** High  
**Due Date:** February 6, 2026  
**Assigned to:** Dani, Angad Malhotra


### Story #6: Profile Editing & Password Change
**As a user, I want to edit my profile and change my password.**

**Tasks:**
- In the account config page, create a form that can be submitted to change password
- Add a field to enter old password, new password, and retype new password
- Update user information on the server and save to the database
- Display a message to let the user know whether the password was successfully changed or not

**Story Points:** 4  
**Priority:** High  
**Risk:** High  
**Due Date:** February 6, 2026  
**Assigned to:** Angad Malhotra

---

### Story #7: Data Persistence
**As a user, I want my data to persist across sessions**

**Tasks:**
- Design a JSON database to keep track of user info as key-value pairs
- Able to easily retrieve data for a specific user among all the others
- Ability to add new users, modify and existing user, delete users, and update the database
- Easily be able to add new attributes to all users in the database

**Story Points:** 3  
**Priority:** High  
**Risk:** Medium  
**Due Date:** February 6, 2026  
**Assigned to:** Ghassan Naja


## Sprint Summary

**Total Story Points:** 25  
**Sprint Duration:** February 2 - February 6, 2026 (4 days)  
**Number of User Stories:** 7  
**Team Size:** 5 members

### Task Distribution
- **Anish Mehra:** Stories #1, #2 (Registration & Login)
- **Ryan Helou:** Stories #1, #2, #4 (Registration, Login, Logout)
- **Ghassan Naja:** Stories #3, #4, #7 (Session Management, Logout, Database)
- **Angad Malhotra:** Stories #5, #6 (Profile Viewing, Editing, Password Change)
- **Dani:** Story #5 (Profile Viewing)

## Risks Identified
- **High Risk:** Stories #2, #5, #6 (Login error handling, Profile viewing, Password change)
- **Medium Risk:** Stories #1, #3, #4, #7 (Registration, Session persistence, Logout, Data persistence)


## Decisions Made
1. Use JSON file-based database for data persistence
2. Implement session-based authentication using Express sessions
3. All team members to commit code by February 6, 2026
4. Daily standup updates via team communication channel
5. Password validation requirements: minimum 8 characters, uppercase, lowercase, and number



