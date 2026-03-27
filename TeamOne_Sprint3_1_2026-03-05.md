# Team One - Sprint 3 Planning Meeting

**Date:** March 5, 2026
**Sprint:** Sprint 3
**Duration:** 2 hours
**Meeting Type:** Sprint Planning


## Attendees
- Anish Mehra
- Ghassan Naja
- Ryan Helou
- Angad Malhotra
- Dani Elbazzi


## Meeting Agenda
1. Review Sprint 2 progress and outcomes
2. Break down Sprint 3 user stories into tasks
3. Assign story points and priorities
4. Distribute tasks among team members
5. Set sprint deadline and deliverables


## Sprint Goal
Implement meal planning functionality and social features for the MealMajor application, including weekly meal plan creation, viewing meals in a grid, editing/removing meals, sending and receiving friend requests, and viewing friends' recipes.


## User Stories & Tasks

### Story #12: Create Weekly Meal Plan
**As a user, I want to create a weekly meal plan so I can organize my meals in advance.**

**Tasks:**
- Add a "Weekly Meal Plan" page to the website
- Allow the user to create a new meal plan for a specific week and select a meal for each day
- Allow the user to edit and delete weekly meal plans once they are created
- Make sure that the recipes created by the user can be added to the weekly meal plan
- Warn the user when trying to create a weekly meal plan for a week that already exists

**Story Points:** 5
**Priority:** High
**Risk:** Medium
**Effort:** Medium
**Due Date:** March 27, 2026
**Assigned to:** Dani Elbazzi, Anish Mehra


### Story #13: View Meals in Weekly Grid
**As a user, I want to view my meals in a weekly grid so I can see my plan at a glance.**

**Tasks:**
- Design a 7-column grid layout for weekly plans
- Fetch the user's meal plan for the selected week from the backend
- Allow the user to navigate between weeks (previous/next)
- Populate grid cells with assigned recipe names, and show unassigned cells
- Allow the user to click on a meal/cell to show meal information

**Story Points:** 3
**Priority:** Medium
**Risk:** Low
**Effort:** Low
**Due Date:** March 27, 2026
**Assigned to:** Dani Elbazzi, Anish Mehra


### Story #14: Edit or Remove Meals from Planner
**As a user, I want to edit or remove meals from my planner so I can adjust my plan as needed.**

**Tasks:**
- Add an "Edit" and "Remove" option on each occupied grid cell
- "Edit" opens the recipe selector to swap the current recipe for a different one
- "Remove" clears the cell and deletes the assignment from the database
- Update the grid UI to reflect the changes and display a confirmation message

**Story Points:** 4
**Priority:** High
**Risk:** High
**Effort:** High
**Due Date:** March 27, 2026
**Assigned to:** Angad Malhotra, Ryan Helou


### Story #15: Send and Receive Friend Requests
**As a user, I want to send and receive friend requests so I can connect with other users on MealMajor.**

**Tasks:**
- Add a "Find Friends" page to the website
- Allow the user to see a list of all usernames, and select users to send a friend request
- Add a search-bar for the user to find specific users
- Show the user incoming friend requests, and give them the option to accept or decline

**Story Points:** 4
**Priority:** High
**Risk:** Medium
**Effort:** Medium
**Due Date:** March 27, 2026
**Assigned to:** Ghassan Naja, Ryan Helou


### Story #16: View Friends' Recipes
**As a user, I want to view my friends' recipes.**

**Tasks:**
- Allow the user to view their friends' recipes
- Give the user the option to toggle between viewing personal and friend recipes
- Make sure updates made to a friend recipe is reflected in the user's account
- Make sure the user can only view their friends' recipes, and not modify them

**Story Points:** 3
**Priority:** Medium
**Risk:** High
**Effort:** High
**Due Date:** March 27, 2026
**Assigned to:** Ghassan Naja, Ryan Helou

---

## Sprint Summary

**Total Story Points:** 19
**Sprint Duration:** March 5 - March 27, 2026
**Number of User Stories:** 5
**Team Size:** 5 members

### Task Distribution
- **Anish Mehra:** Stories #12, #13 (Create Weekly Meal Plan, View Weekly Grid - Backend)
- **Dani Elbazzi:** Stories #12, #13 (Create Weekly Meal Plan, View Weekly Grid - Frontend)
- **Ryan Helou:** Stories #14, #15 (Edit/Remove Meals - Frontend, Friend Requests - Frontend)
- **Angad Malhotra:** Story #14 (Edit/Remove Meals - Backend)
- **Ghassan Naja:** Stories #15, #16 (Friend Requests - Backend, View Friends' Recipes - Backend)

## Risks Identified
- **High Risk:** Stories #14, #16 (Edit/Remove requires proper ownership validation, Friends' recipes requires access control)
- **Medium Risk:** Stories #12, #15 (Meal plan creation complexity, friend request state management)
- **Low Risk:** Story #13 (Weekly grid view is straightforward data display)


## Decisions Made
1. Meal plans stored in JSON file-based database (meal_plan_data.json), consistent with previous sprints
2. Weekly meal plan uses a 7-day grid with Breakfast, Lunch, and Dinner slots per day
3. Users can only add their own recipes or friends' recipes to their meal plan
4. Friend requests require mutual acceptance before recipes are shared
5. Unit tests added using Vitest framework and integrated into CI pipeline (lint -> test -> build)
