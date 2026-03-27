**Anish Mehra - 40305592**

Backend Development (Story #12 - Create Weekly Meal Plan):
- Built MealPlanManagement.js with loadMealPlans, saveMealPlans, getMealPlan, assignMeal, removeMeal, and getWeekStart functions
- Implemented weekly meal plan data structure with 7-day grid (Monday-Sunday) and 3 meal slots per day (Breakfast, Lunch, Dinner)
- Added validation so users can only assign their own or friends' recipes to the meal plan
- Set up JSON file-based persistence for meal plan data (meal_plan_data.json)
Time: 2 hours

Backend Development (Story #13 - View Meals in Weekly Grid):
- Added GET /meal-plan route to Server.js to fetch meal plans by user and week
- Implemented getWeekStart function to compute the Monday of any given week for consistent week-based lookups
- Added POST /meal-plan and DELETE /meal-plan routes for assigning and removing meals
- Added /meal-plan and /users/all proxy routes to vite.config.js
Time: 1.5 hours

Unit Testing & CI/CD:
- Installed Vitest testing framework and added "test" script to package.json
- Created UserManagement.test.js with 13 unit tests covering all Sprint 1 functions (register, login, authenticate, password change, profile update, friends)
- Created RecipeManagement.test.js with 8 unit tests covering all Sprint 2 functions (add, update, delete, get, filter, friend recipes)
- Added test job to CI pipeline (.github/workflows/ci.yml) so tests run automatically on push and PR (lint -> test -> build)
- Added src/__tests__ to ESLint globalIgnores to prevent lint errors on test files
Time: 2 hours

Total Time: 5.5 hrs


**Ghassan Naja - 40264348**
Contribution :

Tested and improved the existing functionality to add, edit and delete recipes.
	- Changed time and cost fields to beome numeric values
	- Changed ingredients field to become a list of strings
	- Ensured the proper behavior of recipeManagement.js, and ensured more robust equality checks
Time : 2hr

Designed function to filter user recipes based on specific criteria
	- able to filter based on max price, max prep time, ingredients, instructions, diet tags, difficulty
	- Implemented functionality to search recipe by title
	- Ensured that only recipes that belong to the user are shown in the search
Time : 2hrs

Designed POST requests for the filter recipe
	- Added /filter, where the user is able to specify search criteria and show the result that fit the criteria
Time : 30min

Total : 4hr 30min


**Ryan Helou - 40315563**
Contribution

Frontend – Story 14: Edit & Remove Meals from Planner

Added "Edit" and "Remove" options to planner cells
Implemented edit (swap recipe) and remove (clear + delete) functionality
Updated grid UI and added confirmation messages
Time: 3 hours

Frontend – Story 15: Friend Requests (Unique Feature)

Built "Find Friends" page
Added user list, search bar, and send request functionality
Handled incoming requests with accept/decline options
Time: 3 hours

Frontend – Story 16: View Friends’ Recipes

Added toggle between personal and friends’ recipes
Displayed friends’ recipes as view-only
Handled updates to reflect changes
Time: 2.5 hours

**Dani Elbazzal - 40225455**

documentation:
-helped in documenatiom
Time: 1:30 

Fronend:
- Built the main RecipePage interface integrating search, filtering, and a responsive recipe grid.
- Developed reusable React components: RecipeCard (for grid display), RecipeDetail (for expanded view), and RecipeForm (for create/edit modals).
- Implemented real-time client-side search and filtering logic (by Prep Time, Difficulty, Cost, and Dietary Tags).
- Wrote 1200+ lines of custom CSS (RecipeManagement.css) matching the project's design system (glassmorphism/gradients).
- Wired up full frontend CRUD capabilities (Create, Read, Edit, Delete) to the existing backend API endpoints.
- Added dynamic UI elements including color-coded difficulty badges, tag pills, and conditional rendering.
- Resolved Vite proxy routing conflict by adding a bypass function for proper React Router navigation.
- Added a full-width "Browse Recipes" button to the Profile page and a "Logout" button to the Recipes page.
- Successfully resolved Git merge conflicts in App.jsx and vite.config.js to integrate the UI into the main branch.

Time: 5 hours


**Angad Malhotra - 40133666**
Back end development & data persistence
Total 4 hours

Backend Development & API Refinement
Total: 4 hours

API Endpoint Optimization (1 hour):
- Refined the /recipes/filter POST route in Server.js to support dynamic query modification
- Implemented || undefined logic to allow the frontend to reset or partially modify filters w
ithout sending stale data

Data Normalization (1.5 hours):
- Added Number() casting for prepTime and cost to ensure string data from forms is processed
as integers
- Synchronized filterCriteria with RecipeManagement.js to ensure "Instructions" are fully sup
ported

System Integration (1 hour):
- Merged main into the feature branch to resolve divergence and ensure compatibility with new
 React UI updates
- Validated the full-stack environment locally, ensuring Node.js and Vite communication is st
able
