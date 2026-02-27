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

Frontend – Story 8: Create Recipe
- Added "New Recipe" button  
- Built recipe creation form (title, ingredients, instructions, prep time, difficulty, cost)  
- Implemented form validation  
- Sent POST request to backend  
- Updated UI with confirmation notification and displayed new recipe  

**Time:** 4 hours  

Frontend – Story 9: Edit & Delete Recipes
- Added "Modify Recipe" button for each recipe  
- Built edit form with pre-filled data  
- Sent POST request for updates  
- Implemented delete functionality  
- Updated UI with confirmation and refreshed recipe list  

**Time:** 5 hours  

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
