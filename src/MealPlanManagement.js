import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getRecipe } from "./RecipeManagement.js";

const file_name = fileURLToPath(import.meta.url);
const dir = path.dirname(file_name);

const data_path = path.join(dir, "Data", "meal_plan_data.json");

/*
  Data format stored in meal_plan_data.json:
  [
    {
      "username": "user1",
      "weekStart": "2026-03-23",          // Monday of that week (ISO date string)
      "meals": {
        "Monday":    { "Breakfast": null, "Lunch": null, "Dinner": null },
        "Tuesday":   { "Breakfast": null, "Lunch": null, "Dinner": null },
        "Wednesday": { "Breakfast": null, "Lunch": null, "Dinner": null },
        "Thursday":  { "Breakfast": null, "Lunch": null, "Dinner": null },
        "Friday":    { "Breakfast": null, "Lunch": null, "Dinner": null },
        "Saturday":  { "Breakfast": null, "Lunch": null, "Dinner": null },
        "Sunday":    { "Breakfast": null, "Lunch": null, "Dinner": null }
      }
    }
  ]

  Each meal slot is either null (unassigned) or an object:
  { "recipeId": 3, "recipeTitle": "Truffle Mushroom Risotto" }
*/

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

let mealPlans = [];

/// Creates an empty week template
function emptyWeekMeals() {
    const meals = {};
    for (const day of DAYS) {
        meals[day] = {};
        for (const type of MEAL_TYPES) {
            meals[day][type] = null;
        }
    }
    return meals;
}

/// Loads meal plans from the JSON file
export function loadMealPlans() {
    try {
        if (!fs.existsSync(data_path)) {
            mealPlans = [];
            return;
        }
        let textContent = fs.readFileSync(data_path, "utf-8");
        textContent = textContent.trim();
        mealPlans = textContent ? JSON.parse(textContent) : [];
    } catch (error) {
        console.log("Error loading meal plan files -", error);
        mealPlans = [];
    }
}

/// Saves meal plans to the JSON file
export function saveMealPlans() {
    try {
        fs.writeFileSync(
            data_path,
            JSON.stringify(mealPlans, null, 2),
            "utf8"
        );
    } catch (error) {
        console.log("Error saving meal plan files -", error);
    }
}

/// Computes the Monday (start of week) for a given date string "YYYY-MM-DD"
export function getWeekStart(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ...
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // shift to Monday
    d.setDate(d.getDate() + diff);
    return d.toISOString().slice(0, 10);
}

/// Returns the meal plan for a given user and week.
/// If none exists yet, returns a fresh empty plan (but does NOT persist it).
export function getMealPlan(username, weekStart) {
    const existing = mealPlans.find(
        (mp) => mp.username === username && mp.weekStart === weekStart
    );
    if (existing) {
        return { ...existing };
    }
    // Return a blank plan for this week (it will be persisted on first assignment)
    return {
        username,
        weekStart,
        meals: emptyWeekMeals()
    };
}

/// Assigns a recipe to a specific slot. Creates the week entry if it doesn't exist yet.
export function assignMeal(username, weekStart, day, mealType, recipeId) {
    if (!DAYS.includes(day)) {
        return { success: false, message: "Invalid day" };
    }
    if (!MEAL_TYPES.includes(mealType)) {
        return { success: false, message: "Invalid meal type" };
    }

    // Look up the recipe to store its title alongside the id
    const recipe = getRecipe(recipeId);
    if (!recipe) {
        return { success: false, message: "Recipe not found" };
    }

    let plan = mealPlans.find(
        (mp) => mp.username === username && mp.weekStart === weekStart
    );

    if (!plan) {
        plan = { username, weekStart, meals: emptyWeekMeals() };
        mealPlans.push(plan);
    }

    plan.meals[day][mealType] = {
        recipeId: recipe.id,
        recipeTitle: recipe.title
    };

    saveMealPlans();
    return { success: true, message: "Meal assigned", plan };
}

/// Removes a recipe from a specific slot
export function removeMeal(username, weekStart, day, mealType) {
    if (!DAYS.includes(day)) {
        return { success: false, message: "Invalid day" };
    }
    if (!MEAL_TYPES.includes(mealType)) {
        return { success: false, message: "Invalid meal type" };
    }

    const plan = mealPlans.find(
        (mp) => mp.username === username && mp.weekStart === weekStart
    );

    if (!plan) {
        return { success: false, message: "No meal plan found for this week" };
    }

    plan.meals[day][mealType] = null;
    saveMealPlans();
    return { success: true, message: "Meal removed", plan };
}
