# Team One - Sprint 2 Planning Meeting

**Date:** February 27, 2026
**Sprint:** Sprint 2
**Duration:** 2 hours
**Meeting Type:** Sprint Planning


## Attendees
- Anish Mehra
- Ghassan Naja
- Ryan Helou
- Angad Malhotra
- Dani Elbazzi


## Meeting Agenda
1. Review Sprint 1 progress and outcomes
2. Break down Sprint 2 user stories into tasks
3. Assign story points and priorities
4. Distribute tasks among team members
5. Set sprint deadline and deliverables


## Sprint Goal
Implement core recipe management functionality for the MealMajor application, including creating, editing, deleting, searching, and filtering recipes.


## User Stories & Tasks

### Story #8: Create Recipe
**As a user, I want to create a recipe so I can store and share my meals.**

**Tasks:**
- Add "New Recipe" button for the UI
- Create form for recipe (title, ingredients, instructions, prep time, difficulty, cost, ...)
- Send form data as POST request and add to the database
- Update UI to reflect the new added recipe (display notification to user, show the recipe on the list)

**Story Points:** 4
**Priority:** High
**Risk:** Medium
**Effort:** Medium
**Due Date:** February 27, 2026
**Assigned to:** Anish Mehra, Ryan Helou


### Story #9: Edit & Delete Recipe
**As a user, I want to edit and delete recipes so I can manage my saved meals.**

**Tasks:**
- Create "Modify Recipe" button for each recipe added
- Create the form to edit the recipe
- Send form data as POST request and add to the database
- Update UI to reflect the new added recipe (display notification to user, show the recipe on the list)

**Story Points:** 5
**Priority:** High
**Risk:** High
**Effort:** High
**Due Date:** February 27, 2026
**Assigned to:** Anish Mehra, Ryan Helou


### Story #10: Search Recipes by Keywords
**As a user, I want to search recipes by keywords so I can quickly find what I'm looking for.**

**Tasks:**
- Create "Search Recipe" menu item with a textbox to type the recipe name
- Send the search criteria to the backend, and return a list of recipes that match it
- Update the UI to limit the recipes to the ones that match the search

**Story Points:** 3
**Priority:** Medium
**Risk:** Low
**Effort:** Low
**Due Date:** February 27, 2026
**Assigned to:** Ghassan Naja, Dani Elbazzi


### Story #11: Filter Recipes
**As a user, I want to filter recipes by time to cook, difficulty, cost, and dietary tags so I can find recipes that match my needs.**

**Tasks:**
- Create a "Filter Recipe" form to filter by time, difficulty, cost, dietary tag
- Send the filter criteria to the backend as POST request, and respond with the recipes that match the criteria
- Allow the user to reset their filters, or modify them
- Update the UI to reflect the changes

**Story Points:** 4
**Priority:** Medium
**Risk:** Medium
**Effort:** Medium
**Due Date:** February 27, 2026
**Assigned to:** Angad Malhotra, Dani Elbazzi

---

## Sprint Summary

**Total Story Points:** 16
**Sprint Duration:** February 6 - February 27, 2026
**Number of User Stories:** 4
**Team Size:** 5 members

### Task Distribution
- **Anish Mehra:** Stories #8, #9 (Create Recipe, Edit & Delete Recipe - Backend)
- **Ryan Helou:** Stories #8, #9 (Create Recipe, Edit & Delete Recipe - Frontend)
- **Ghassan Naja:** Story #10 (Search Recipes - Backend)
- **Angad Malhotra:** Story #11 (Filter Recipes - Backend)
- **Dani Elbazzi:** Stories #10, #11 (Search & Filter Recipes - Frontend)

## Risks Identified
- **High Risk:** Story #9 (Edit & Delete requires ownership validation and proper UI handling)
- **Medium Risk:** Stories #8, #11 (Recipe creation form complexity, filter criteria handling)
- **Low Risk:** Story #10 (Search is straightforward keyword matching)


## Decisions Made
1. Recipes stored in JSON file-based database (recipe_data.json), consistent with Sprint 1 approach
2. Only recipe creators can edit or delete their own recipes
3. Filter supports prep time, difficulty, cost, and dietary tags
4. Search is client-side by title, filtering is handled via backend POST request
5. CI pipeline set up with ESLint and Vite build checks on push and pull requests
