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

Added functionality to send and receive friend requests
	- Ensured users can see the usernames of other users
	- Ensured users can send requests and receive them
	- Ensured users can see incoming requests and choose to accept or decline
	- Ensured friend data persists across sessions
Time : 1hr 30min

Added functionality to view the recipes of friends
	- Ensured the user can toggle between viewing friend recipes and own recipes
	- Ensured the user can only view friend recipes, not edit them
	- Ensured data persists across sessions and is updated across all users when changed
Time : 3hrs

Tested the new features related to friend management
	- Wrote tests to find bugs and catch bad behavior
	- Tested edge cases and ensured this feature is well-integrated with the other features
	- Found and reported 2 bugs related to friend management to be fixed
Time : 1hr

Total : 5hr 30min


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

Fronend:
-Implemented a 7 Column Grid Layout: Built a dedicated weekly view organizing meals into three distinct rows for Breakfast, Lunch, and Dinner.
-Added Dynamic Week Navigation: Built navigation controls allowing users to seamlessly browse through their meal plans for any given week.
-Engineered Recipe Assignment: Created an interactive flow where clicking empty grid cells opens a searchable recipe picker modal to easily assign meals to specific slots.
-Integrated Detailed Meal Information: Designed interactive filled cells that display full recipe details (ingredients, instructions, cost, prep time) when clicked.
-Developed "Remove from Plan" Functionality: Provided users the ability to delete meals directly via a '✕' button on the cells or through a dedicated button inside the detail modal.
-Optimized Responsive Design: Ensured the grid layout and modals adapt gracefully to smaller screens for an accessible mobile and desktop experience.
-Added "Today" Highlighting: Implemented visual highlighting on the grid interface to dynamically emphasize the current day's column for better user orientation.

Backend:
-Enabled Persistent Storage: Integrated backend data saving and loading using meal_plan_data.json to ensure meal plans persist properly across page reloads and sessions.


Total Time: 6 hours


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
