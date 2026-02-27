import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file_name = fileURLToPath(import.meta.url);
const dir = path.dirname(file_name);

const data_path = path.join(dir, "Data", "recipe_data.json");

let recipes = []
let nextId = 1

export const difficultyLevels = Object.freeze({
    Easy : "Easy",
    Medium : "Medium",
    Hard : "Hard",
    Hell : "Hell"
})

export const dietaryTags = Object.freeze({
    Vegan : "Vegan",
    Vegetarian : "Vegetarian",
    Fish : "Fish",
    RedMeat : "Red Meat",
    Dessert : "Dessert",
    HighProtein : "High Protein",
    LowCalories : "Low Calories"
})

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
    const { title, ingredients, instructions, prepTime, difficulty, cost, dietary } = recipeData;

    if (!title || !title.trim()) {
        return { success: false, message: "Recipe title is required" };
    }

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length == 0) {
        return { success: false, message: "Ingredients are required as list" };
    }

    if (!instructions || !instructions.trim()) {
        return { success: false, message: "Instructions are required" };
    }

    if (prepTime !== undefined) {
    const numericPrepTime = Number(prepTime);

    if (!Number.isFinite(numericPrepTime) || numericPrepTime <= 0) {
            return { success: false, message: "Prep time must be a positive number" };
        }
    }

    if (cost !== undefined) {
    const numericCost = Number(cost);

    if (!Number.isFinite(numericCost) || numericCost <= 0) {
            return { success: false, message: "Cost must be a positive number" };
        }
    }

    if (difficulty !== undefined && !Object.values(difficultyLevels).includes(difficulty)) {
    return { success: false, message: "Invalid difficulty level" };
    }

    if (dietary !== undefined) {
        if (!Array.isArray(dietary)) {
            return { success: false, message: "Dietary tags must be an array" };
        }
        
        const validTags = Object.values(dietaryTags);

        for (const tag of dietary) {
            if (!validTags.includes(tag)) {
                return { success: false, message: "Invalid dietary tag" };
            }
        }
    }

    const recipe = {
        id: nextId++,
        title: title.trim(),
        ingredients: [...ingredients],
        instructions: instructions.trim(),
        prepTime: prepTime !== undefined ? Number(prepTime) : "",
        difficulty: difficulty || "",
        cost: cost !== undefined ? Number(cost) : "",
        dietaryTags: dietary ? [...dietary] : [],
        createdBy: username
    };

    recipes.push(recipe);
    saveRecipes();
    return { success: true, message: "Recipe created successfully", recipe };
}

/// Updates an existing recipe (only if the user is the creator)
export function updateRecipe(id, username, recipeData) {
    
    const recipe = getRecipe(id);
    if (!recipe) {
        return { success: false, message: "Recipe not found" };
    }

    if (recipe.createdBy !== username) {
        return { success: false, message: "You can only edit your own recipes" };
    }

    const { title, ingredients, instructions, prepTime, difficulty, cost, dietary } = recipeData;

    if (title !== undefined && !title.trim()) {
        return { success: false, message: "Recipe title cannot be empty" };
    }

    if (ingredients !== undefined && (!Array.isArray(ingredients) || ingredients.length == 0)) {
        return { success: false, message: "Ingredients cannot be empty" };
    }

    if (cost !== undefined) {
        const numericCost = Number(cost);
        if (!Number.isFinite(numericCost) || numericCost <= 0)
            return { success: false, message: "Cost must be a positive number" };
    }
    if (prepTime !== undefined) {
        const numericPrep = Number(prepTime);
        if (!Number.isFinite(numericPrep) || numericPrep <= 0)
            return { success: false, message: "Prep time must be a positive number" };
    }

    if (difficulty !== undefined && !Object.values(difficultyLevels).includes(difficulty)) {
        return { success: false, message: "Invalid difficulty level" };
    }

    if (dietary !== undefined &&
        (!Array.isArray(dietary)
        || dietary.some(tag => !Object.values(dietaryTags).includes(tag)))) {
            return { success: false, message: "Invalid dietary tag" };
        }

    if (title !== undefined) recipe.title = title.trim();
    if (ingredients !== undefined) recipe.ingredients = [...ingredients];
    if (instructions !== undefined) recipe.instructions = instructions.trim();
    if (prepTime !== undefined) recipe.prepTime = Number(prepTime);
    if (difficulty !== undefined) recipe.difficulty = difficulty;
    if (dietary !== undefined) recipe.dietaryTags = [...dietary];
    if (cost !== undefined) recipe.cost = Number(cost);

    saveRecipes();
    return { success: true, message: "Recipe updated successfully", recipe };
}

/// Deletes a recipe (only if the user is the creator)
export function deleteRecipe(id, username) {
    const recipe = getRecipe(id);
    if (!recipe) {
        return { success: false, message: "Recipe not found" };
    }

    if (recipe.createdBy !== username) {
        return { success: false, message: "You can only delete your own recipes" };
    }

    recipes = recipes.filter(r => r.id !== id);
    saveRecipes();
    return { success: true, message: "Recipe deleted successfully" };
}

/// Filter recipes based on filterCriteria. title, ingredients, instructions, prepTime, difficulty, cost, dietaryTags
export function filterRecipes(filterCriteria) {

    const filter = {
        title : filterCriteria["title"] || undefined,
        ingredients : filterCriteria["ingredients"] || undefined,
        instructions : filterCriteria["instructions"] || undefined,
        prepTime : filterCriteria["prepTime"] || undefined,
        difficulty : filterCriteria["difficulty"] || undefined,
        cost : filterCriteria["cost"] || undefined,
        dietaryTags : filterCriteria["dietaryTags"] || undefined,
    }

    const {title, ingredients, instructions, prepTime, difficulty, cost, dietaryTags} = filter;

    return recipes.filter(recipe => {
        if (title) {
            if (!recipe.title
                .toLowerCase()
                .includes(title.toLowerCase()))
                    return false
        }
        
        if (ingredients) {
            for (const ingredient of ingredients) {
                if (!recipe.ingredients.some(
                    ing => ing.trim().toLowerCase() === ingredient.trim().toLowerCase()
                )) {
                    return false;
                }
            }
        }

        if (instructions) {
            if (!recipe.instructions
                .toLowerCase()
                .includes(instructions.toLowerCase())) {
                return false;
            }
        }

        const numericPrep = prepTime !== undefined ? Number(prepTime) : undefined;
        const numericCost = cost !== undefined ? Number(cost) : undefined;

        if (numericPrep && recipe.prepTime > numericPrep) {
            return false
        }
        if (difficulty && getDifficultyLevel(recipe.difficulty) > getDifficultyLevel(difficulty)) {
            return false
        }
        if (numericCost && recipe.cost > numericCost) {
            return false
        }
        if (dietaryTags && recipe.dietaryTags) {
            for (const tag of dietaryTags) {
                if (!recipe.dietaryTags.some(t => t.trim() === tag.trim())) return false;
            }
        }

        return true;
    })
}

function getDifficultyLevel(difficulty) {
    switch(difficulty) {
        case "Easy":
            return 0
        case "Medium":
            return 1
        case "Hard":
            return 2
        case "Hell":
            return 3
    }

    return -1;
}