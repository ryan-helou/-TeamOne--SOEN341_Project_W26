**Anish Mehra - 40305592**

Backend Development (Story #8 - Create Recipe):
- Created RecipeManagement.js with loadRecipes, saveRecipes, getRecipe, getAllRecipes, getRecipesByUser, and addRecipe functions
- Added POST /recipes, GET /recipes, and GET /recipes/mine routes to Server.js
- Implemented recipe data validation (title, ingredients, instructions, prepTime, cost, difficulty, dietary tags)
- Set up JSON file-based persistence for recipe data (recipe_data.json)
Time: 2 hours

Backend Development (Story #9 - Edit & Delete Recipe):
- Implemented updateRecipe and deleteRecipe functions in RecipeManagement.js
- Added POST /recipes/:id and DELETE /recipes/:id routes to Server.js
- Added ownership validation so users can only edit/delete their own recipes
Time: 1.5 hours

Bug Fixing:
- Fixed recipe visibility bug where all users' recipes were showing instead of only the logged-in user's recipes (changed fetch endpoint from /recipes to /recipes/mine)
- Added /recipes proxy with HTML bypass to vite.config.js so React Router works alongside API calls
Time: 0.5 hours

CI/CD:
- Set up GitHub Actions CI pipeline (.github/workflows/ci.yml) with lint and build jobs
- Fixed ESLint errors across multiple files (removed unused variables) to ensure CI passes
Time: 1 hour

Total Time: 5 hrs


**Ghassan Naja - 40264348**
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


**Ryan Helou - 40315563**
Contribution:

Login Page:
- Designed the UI for the log in page with username, password, and forget password.
- Implemented the log in page
- Displayed error messages if conditions were not met
Time: 1:30

Registration Page:
- Designed the UI for the registration page (username, password, retype password)
- Implemented the registration page
- Displayed error messages if conditions were not met (including password and username conditions)
Time: 1:30

Fixed a bug where page was not loading correct components and css values:
Time: 30 minutes

Logout:
- Designed and implemented log out button information


**Dani Elbazzal - 40225455**

documentation:
-helped in excel documenatiom
Time: 1:30 

Fronend:
(profile managemnet)
-Displays user profile information
-Shows avatar, username, full name, diet, allergies, preferences
-Navigation buttons for editing
-Form to edit profile data
-Fields: full name, dietary preferences, allergies, preferences
-Save and cancel buttons
-Password change form
-Validation: 8+ chars, uppercase, lowercase, number
-Current, new, and confirm password field
-Purple gradient design
-Responsive layout (mobile/tablet/desktop)
-Dark and light mode support
-Hover animations

Time: 4 hours


**Angad Malhotra - 40133666**
Back end development & data persistence
Total 4 hours

API endpoint creation (1 hour)
Developed scure POST routes in Node.js (/update-profile and /change-password) to handle incoming data from the frontend

Business logic implementation (2 hours)
- Wrote validation logic to ensure "New Password" and "Confirm Password" fields match
- Integrated session-based authentication to ensure users can only update their own profiles
- Implemented "Old Password" verification to add layer of security before allowing credential changes

Data persistence (0.5 hours):
Created a saving mechanism in UserManagement.js that uses fs.writeFileSync to ensure user upd
ates are permanently stored in the JSON database

Reponse handling (0.5 hours):
Developed a standardized JSON response system (returning success: booleon and message: string) to provide clear feedback to the frontend and the end-user
