# Team One - Sprint 4 Planning Meeting

**Date:** April 3, 2026
**Sprint:** Sprint 4
**Duration:** 2 hours
**Meeting Type:** Sprint Planning


## Attendees
- Anish Mehra
- Ghassan Naja
- Ryan Helou
- Angad Malhotra
- Dani Elbazzi


## Meeting Agenda
1. Review Sprint 3 progress and outcomes
2. Break down Sprint 4 tasks and user stories
3. Assign maintenance and quality assurance tasks
4. Distribute tasks among team members
5. Set sprint deadline and deliverables


## Sprint Goal
Improve code quality and maintainability of the MealMajor application through repository reorganization, unit and acceptance testing, static analysis bug fixes, code reviews, and implementing a duplicate meal prevention feature.


## User Stories & Tasks

### Story #17: Prevent Duplicate Meals in Weekly Planner
**As a user, I want my weekly meal planner to prevent duplicate meals so I don't accidentally add the same meal twice.**

**Tasks:**
- Make sure the user can't enter the same meal twice for the same week
- Display an error message to let the user know their meal wasn't added
- In the backend, prevent writing duplicate meals in the planner

**Story Points:** 2
**Priority:** Medium
**Risk:** Low
**Effort:** Low
**Due Date:** April 10, 2026
**Assigned to:** Angad Malhotra, Dani Elbazzi


### Maintenance: Repository Reorganization
**Reorganize the file structure according to Sprint 4 guidelines.**

**Tasks:**
- Separate frontend components into `src/components/` organized by feature (auth, recipes, mealplan, friends)
- Move backend logic into `src/server/`
- Update all import paths across the codebase
- Verify tests and build still pass after reorganization

**Priority:** High
**Assigned to:** Anish Mehra


### Maintenance: Unit & Acceptance Testing
**Create unit tests for Sprints 1-3 and write acceptance tests for all stories.**

**Tasks:**
- Install Vitest testing framework and add test script to CI pipeline
- Write unit tests for UserManagement (13 tests) and RecipeManagement (8 tests)
- Write acceptance test descriptions for all 16 user stories
- Ensure tests run automatically in CI (lint → test → build)

**Priority:** High
**Assigned to:** Anish Mehra


### Maintenance: Static Analysis Bug Fixes
**Run ESLint with stricter rules and fix 5 bugs found by static analysis.**

**Tasks:**
- Run ESLint with `eqeqeq` and `no-console` rules to identify bugs
- Fix loose equality (`==`) in RecipeManagement.js (lines 88, 165)
- Fix loose equality (`==`) in UserManagement.js (line 208)
- Remove `console.error` from ProfileEdit.jsx and ProfileView.jsx
- Clean up unused `error` variables in catch blocks

**Priority:** High
**Assigned to:** Anish Mehra (2 bugs), Ghassan Naja (1 bug), Ryan Helou (1 bug), Angad Malhotra (1 bug)


### Maintenance: Code Reviews
**Perform code reviews on new features implemented in Sprint 3.**

**Tasks:**
- Each team member reviews at least one other member's pull request
- Leave constructive feedback on code quality, error handling, and naming conventions
- Approve or request changes through GitHub's review system

**Priority:** High
**Assigned to:** All team members


### Maintenance: Coding Standards
**Define and document coding standards for the project.**

**Tasks:**
- Establish naming conventions for files, variables, and functions
- Define rules for imports, module structure, and testing patterns
- Ensure all team members follow the agreed-upon standards

**Priority:** Medium
**Assigned to:** Anish Mehra

---

## Sprint Summary

**Total Story Points:** 2
**Sprint Duration:** April 3 - April 10, 2026
**Number of User Stories:** 1 (+ 5 maintenance tasks)
**Team Size:** 5 members

### Task Distribution
- **Anish Mehra:** Repository reorganization, unit testing & CI, static analysis (2 bugs), coding standards documentation
- **Ghassan Naja:** Static analysis (1 bug), code review, final verification and testing
- **Ryan Helou:** Static analysis (1 bug), code review, final verification and testing
- **Angad Malhotra:** Story #17 (Duplicate meal prevention - Backend), static analysis (1 bug), code review
- **Dani Elbazzi:** Story #17 (Duplicate meal prevention - Frontend), code review, final verification and testing

## Risks Identified
- **Low Risk:** Story #17 (Straightforward validation check on existing meal plan logic)
- **Medium Risk:** Repository reorganization (many files moved, import paths must all be updated correctly)


## Decisions Made
1. Reorganized repository into `src/components/` (frontend) and `src/server/` (backend) following separation of concerns
2. Adopted Vitest as the testing framework for native ES module and Vite compatibility
3. ESLint used as the static analysis tool with stricter rules (`eqeqeq`, `no-console`) to catch additional bugs
4. All team members must participate in at least one code review per sprint
5. Coding standards documented and shared with the team for consistent development practices
