import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file_name = fileURLToPath(import.meta.url);
const dir = path.dirname(file_name);

const data_path = path.join(dir, "Data", "recipe_data.json");

let recipes = []
let nextId = 1

/// Loads the recipes from the database
export function loadRecipes() {
    try {
        if (!fs.existsSync(data_path)) {
            recipes = []
            return;
        }
        let textContent = fs.readFileSync(data_path, "utf-8");
        textContent = textContent.trim()
        recipes = textContent ? JSON.parse(textContent) : []
    } catch (error) {
        console.log("Error loading recipe files -", error);
        recipes = [];
    }
    // Set nextId based on existing recipes
    if (recipes.length > 0) {
        nextId = Math.max(...recipes.map(r => r.id)) + 1;
    }
}

/// Saves the recipes to the database
export function saveRecipes() {
    try {
        fs.writeFileSync(
            data_path,
            JSON.stringify(recipes, null, 2),
            "utf8"
        );
    } catch (error) {
        console.log("Error saving recipe files -", error);
    }
}

/// Returns a recipe by its id
export function getRecipe(id) {
    return recipes.find(recipe => recipe.id === id);
}

/// Returns all recipes
export function getAllRecipes() {
    return recipes;
}

/// Returns all recipes created by a specific user
export function getRecipesByUser(username) {
    return recipes.filter(recipe => recipe.createdBy === username);
}

/// Creates a new recipe and saves it to the database
export function addRecipe(username, recipeData) {
    const { title, ingredients, instructions, prepTime, difficulty, cost } = recipeData;

    if (!title || !title.trim()) {
        return { success: false, message: "Recipe title is required" };
    }

    if (!ingredients || !ingredients.trim()) {
        return { success: false, message: "Ingredients are required" };
    }

    if (!instructions || !instructions.trim()) {
        return { success: false, message: "Instructions are required" };
    }

    const recipe = {
        id: nextId++,
        title: title.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        prepTime: prepTime || "",
        difficulty: difficulty || "",
        cost: cost || "",
        createdBy: username
    };

    recipes.push(recipe);
    saveRecipes();
    return { success: true, message: "Recipe created successfully", recipe };
}
