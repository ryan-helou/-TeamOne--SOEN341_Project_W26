Anish Mehra - 40305592

Backend Development:
- Understood the existing code.
- Implemented user registration endpoint with password validation, added error handling to login endpoint, enhanced     authentication logic. 
 Time: 2 hours 

Frontend Development:
- Fixed UI centering issues, updated App.jsx with proper state management for ProfilePage, integrated ProfileEdit and ChangePassword components
- Fixed layout issues in index.css and App.css, implemented flexbox centering for login and profile pages
- Fixed layout issues in index.css and App.css, implemented flexbox centering for login and profile pages
 Time Spent: 1.5 hours

Testing and Debugging: 
- Tested authentication flow, debugged profile data fetching errors, verified session management
 Time spent: 0.5 hours

 Total Time: 4 hrs


Ghassan Naja - 40264348
Contribution :

Wrote down the method signatures for all significant methods in Server.js, to act as a basis for implementation
	- Did not implement each function, but wrote down their signature
Time : 1hr

Designed methods to write and load user information from a JSON file (acts as a database)
	- Implemented methods getUser, updateUser, removeUser, authenticateUser, changePassword, addAttributeToUsers, validateUser
	- Implemented Test method testUserDatabase (to ensure the DB works properly)
Time : 2hrs

Designed GET and POST requests for the server to respond to the frontend
	- Added /login to manage the login page
	- Added /logout to manage the logout page
	- Added /user/:key to enable access to specific user attributes
Time : 1hr 30min

Fixed a bug when trying to find the value of a key in the dict containing user data
	- fixed the getUserAttribute method.
Time : 30min

Total time : 5 hours

Ryan Helou - 40315563
Contribution:

Login Page:
- Designed the UI for the log in page with username, password, and forget password.
- Implemented the log in page
- Displayed error messages if conditions were not met
Time: 1:30

Registration Page:
- Deisgned the UI for the registration page (username, password, retype password)
- Implemented the registration page
- Displayed error messages if conditions were not met (including password and username conditions)
Time: 1:30

Fixed a bug where page was not loading correct components and css values:
Time: 1:00



Angad Malhotra - 40133666

Back end development & data persistence
Total 4 hours

API endpoint creation (1 hour)
Developed scure POST routes in Node.js (/update-profile and /change-password) to handle incoming data from the frontend

Business logic implementation (2 hours)
-Wrote validation logic to ensure "New Password" and "Confirm Password" fields match
-Integrated session-based authentication to ensure users can only update their own profiles
-Implemented "Old Password" verification to add layer of security before allowing credential
changes

Data persistence (0.5 hours):
Created a saving mechanism in UserManagement.js that uses fs.writeFileSync to ensure user upd
ates are permanently stored in the JSON database

Reponse handling (0.5 hours):
Developed a standardized JSON response system (returning success: booleon and message: string) to provide clear feedback to the frontend and the end-user
