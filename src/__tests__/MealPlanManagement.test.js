import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock filesystem so tests don't touch real files
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(() => false),
        readFileSync: vi.fn(() => '[]'),
        writeFileSync: vi.fn(),
    },
}))

// Mock UserManagement (needed by RecipeManagement which MealPlanManagement imports)
vi.mock('../server/UserManagement.js', () => ({
    getFriends: vi.fn(() => []),
}))

import fs from 'fs'
import { getFriends } from '../server/UserManagement.js'
import { loadRecipes, addRecipe } from '../server/RecipeManagement.js'
import {
    loadMealPlans,
    assignMeal,
    getMealPlan,
    removeMeal,
} from '../server/MealPlanManagement.js'

const WEEK = '2026-04-06' // a Monday

beforeEach(() => {
    vi.clearAllMocks()
    fs.existsSync.mockReturnValue(false)
    fs.readFileSync.mockReturnValue('[]')
    fs.writeFileSync.mockImplementation(() => {})
    loadRecipes()
    loadMealPlans()
})

/** Helper: create a recipe owned by `user` and return its id */
function createRecipe(user, title = 'Test Recipe') {
    const result = addRecipe(user, {
        title,
        ingredients: ['ingredient1'],
        instructions: 'Do the thing',
    })
    return result.recipe.id
}

describe('assignMeal', () => {
    it('assigns a meal successfully', () => {
        const recipeId = createRecipe('alice')
        const result = assignMeal('alice', WEEK, 'Monday', 'Breakfast', recipeId)
        expect(result.success).toBe(true)
        expect(result.plan.meals['Monday']['Breakfast'].recipeId).toBe(recipeId)
    })

    it('rejects a duplicate recipe in the same week', () => {
        const recipeId = createRecipe('alice')

        // First assignment succeeds
        const first = assignMeal('alice', WEEK, 'Monday', 'Breakfast', recipeId)
        expect(first.success).toBe(true)

        // Second assignment of the SAME recipe to a DIFFERENT slot should fail
        const second = assignMeal('alice', WEEK, 'Wednesday', 'Dinner', recipeId)
        expect(second.success).toBe(false)
        expect(second.message).toContain('already planned')
    })

    it('allows the same recipe in different weeks', () => {
        const recipeId = createRecipe('alice')

        const week1 = assignMeal('alice', WEEK, 'Monday', 'Breakfast', recipeId)
        expect(week1.success).toBe(true)

        const nextWeek = '2026-04-13'
        const week2 = assignMeal('alice', nextWeek, 'Monday', 'Breakfast', recipeId)
        expect(week2.success).toBe(true)
    })

    it('allows re-assigning a recipe to the same slot (overwrite)', () => {
        const recipeId = createRecipe('alice')

        const first = assignMeal('alice', WEEK, 'Tuesday', 'Lunch', recipeId)
        expect(first.success).toBe(true)

        // Re-assigning to the exact same slot should succeed (it skips itself)
        const second = assignMeal('alice', WEEK, 'Tuesday', 'Lunch', recipeId)
        expect(second.success).toBe(true)
    })

    it('rejects an invalid day', () => {
        const recipeId = createRecipe('alice')
        const result = assignMeal('alice', WEEK, 'Funday', 'Breakfast', recipeId)
        expect(result.success).toBe(false)
        expect(result.message).toContain('Invalid day')
    })

    it('rejects an invalid meal type', () => {
        const recipeId = createRecipe('alice')
        const result = assignMeal('alice', WEEK, 'Monday', 'Brunch', recipeId)
        expect(result.success).toBe(false)
        expect(result.message).toContain('Invalid meal type')
    })

    it('rejects a non-existent recipe', () => {
        const result = assignMeal('alice', WEEK, 'Monday', 'Breakfast', 99999)
        expect(result.success).toBe(false)
        expect(result.message).toContain('Recipe not found')
    })

    it('rejects a recipe that does not belong to the user or their friends', () => {
        const recipeId = createRecipe('bob')
        getFriends.mockReturnValue([])  // alice has no friends
        const result = assignMeal('alice', WEEK, 'Monday', 'Breakfast', recipeId)
        expect(result.success).toBe(false)
        expect(result.message).toContain('own or friends')
    })
})

describe('removeMeal', () => {
    it('removes an assigned meal', () => {
        const recipeId = createRecipe('alice')
        assignMeal('alice', WEEK, 'Monday', 'Breakfast', recipeId)
        const result = removeMeal('alice', WEEK, 'Monday', 'Breakfast')
        expect(result.success).toBe(true)
        expect(result.plan.meals['Monday']['Breakfast']).toBeNull()
    })

    it('allows adding a previously removed recipe back', () => {
        const recipeId = createRecipe('alice')
        assignMeal('alice', WEEK, 'Monday', 'Breakfast', recipeId)
        removeMeal('alice', WEEK, 'Monday', 'Breakfast')

        // Should succeed since the recipe is no longer in any slot
        const result = assignMeal('alice', WEEK, 'Wednesday', 'Dinner', recipeId)
        expect(result.success).toBe(true)
    })
})

describe('getMealPlan', () => {
    it('returns an empty plan for a new week', () => {
        const plan = getMealPlan('alice', WEEK)
        expect(plan.username).toBe('alice')
        expect(plan.weekStart).toBe(WEEK)
        expect(plan.meals['Monday']['Breakfast']).toBeNull()
    })
})
