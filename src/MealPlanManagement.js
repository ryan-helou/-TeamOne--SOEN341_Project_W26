import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getRecipe, getRecipesByUser } from "./RecipeManagement.js";

const file_name = fileURLToPath(import.meta.url);
const dir = path.dirname(file_name);

const data_path = path.join(dir, "Data", "mealplan_data.json");

let mealPlans = [];
let nextId = 1;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/// Loads the meal plans from the database
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
    if (mealPlans.length > 0) {
        nextId = Math.max(...mealPlans.map(mp => mp.id)) + 1;
    }
}

/// Saves the meal plans to the database
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

/// Returns all meal plans for a specific user
export function getMealPlansByUser(username) {
    return mealPlans.filter(mp => mp.username === username);
}

/// Returns a meal plan by its id
export function getMealPlan(id) {
    return mealPlans.find(mp => mp.id === id);
}

/// Creates a new meal plan for a specific week
export function createMealPlan(username, mealPlanData) {
    const { weekStart, meals } = mealPlanData;

    if (!weekStart || !weekStart.trim()) {
        return { success: false, message: "Week start date is required" };
    }

    // Check if a meal plan already exists for this week
    const existing = mealPlans.find(
        mp => mp.username === username && mp.weekStart === weekStart.trim()
    );
    if (existing) {
        return { success: false, message: "A meal plan already exists for this week" };
    }

    // Build the meals object — validate that recipe IDs belong to the user
    const userRecipes = getRecipesByUser(username);
    const userRecipeIds = userRecipes.map(r => r.id);
    const weekMeals = {};

    for (const day of DAYS) {
        if (meals && meals[day] !== undefined && meals[day] !== null) {
            const recipeId = Number(meals[day]);
            if (!Number.isFinite(recipeId)) {
                return { success: false, message: `Invalid recipe ID for ${day}` };
            }
            const recipe = getRecipe(recipeId);
            if (!recipe) {
                return { success: false, message: `Recipe not found for ${day}` };
            }
            if (!userRecipeIds.includes(recipeId)) {
                return { success: false, message: `You can only add your own recipes to the meal plan` };
            }
            weekMeals[day] = recipeId;
        } else {
            weekMeals[day] = null;
        }
    }

    const mealPlan = {
        id: nextId++,
        username,
        weekStart: weekStart.trim(),
        meals: weekMeals
    };

    mealPlans.push(mealPlan);
    saveMealPlans();
    return { success: true, message: "Meal plan created successfully", mealPlan };
}

/// Updates an existing meal plan (only if the user is the owner)
export function updateMealPlan(id, username, mealPlanData) {
    const mealPlan = getMealPlan(id);
    if (!mealPlan) {
        return { success: false, message: "Meal plan not found" };
    }

    if (mealPlan.username !== username) {
        return { success: false, message: "You can only edit your own meal plans" };
    }

    const { weekStart, meals } = mealPlanData;

    // If changing the week, check for duplicates
    if (weekStart !== undefined) {
        if (!weekStart.trim()) {
            return { success: false, message: "Week start date cannot be empty" };
        }
        const existing = mealPlans.find(
            mp => mp.username === username && mp.weekStart === weekStart.trim() && mp.id !== id
        );
        if (existing) {
            return { success: false, message: "A meal plan already exists for this week" };
        }
        mealPlan.weekStart = weekStart.trim();
    }

    // Update meals if provided
    if (meals !== undefined) {
        const userRecipes = getRecipesByUser(username);
        const userRecipeIds = userRecipes.map(r => r.id);

        for (const day of DAYS) {
            if (meals[day] !== undefined) {
                if (meals[day] === null) {
                    mealPlan.meals[day] = null;
                } else {
                    const recipeId = Number(meals[day]);
                    if (!Number.isFinite(recipeId)) {
                        return { success: false, message: `Invalid recipe ID for ${day}` };
                    }
                    const recipe = getRecipe(recipeId);
                    if (!recipe) {
                        return { success: false, message: `Recipe not found for ${day}` };
                    }
                    if (!userRecipeIds.includes(recipeId)) {
                        return { success: false, message: "You can only add your own recipes to the meal plan" };
                    }
                    mealPlan.meals[day] = recipeId;
                }
            }
        }
    }

    saveMealPlans();
    return { success: true, message: "Meal plan updated successfully", mealPlan };
}

/// Deletes a meal plan (only if the user is the owner)
export function deleteMealPlan(id, username) {
    const mealPlan = getMealPlan(id);
    if (!mealPlan) {
        return { success: false, message: "Meal plan not found" };
    }

    if (mealPlan.username !== username) {
        return { success: false, message: "You can only delete your own meal plans" };
    }

    mealPlans = mealPlans.filter(mp => mp.id !== id);
    saveMealPlans();
    return { success: true, message: "Meal plan deleted successfully" };
}
