import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(() => false),
        readFileSync: vi.fn(() => '[]'),
        writeFileSync: vi.fn(),
    },
}))

vi.mock('../UserManagement.js', () => ({
    getFriends: vi.fn(),
}))

import fs from 'fs'
import { getFriends } from '../UserManagement.js'
import {
    loadRecipes, addRecipe, updateRecipe, deleteRecipe,
    getRecipe, getAllRecipes, getRecipesByUser,
    filterRecipes, getFriendRecipes,
} from '../RecipeManagement.js'

const validRecipe = {
    title: 'Pasta',
    ingredients: ['noodles', 'sauce'],
    instructions: 'Boil noodles then add sauce',
}

beforeEach(() => {
    vi.clearAllMocks()
    fs.existsSync.mockReturnValue(false)
    fs.readFileSync.mockReturnValue('[]')
    fs.writeFileSync.mockImplementation(() => {})
    loadRecipes()
})

describe('addRecipe', () => {
    it('creates a recipe with valid data', () => {
        const result = addRecipe('alice', validRecipe)
        expect(result.success).toBe(true)
        expect(result.recipe.createdBy).toBe('alice')
        expect(typeof result.recipe.id).toBe('number')
    })
})

describe('updateRecipe', () => {
    it('updates a recipe when user is the creator', () => {
        const { recipe } = addRecipe('alice', validRecipe)
        const result = updateRecipe(recipe.id, 'alice', { title: 'Updated Pasta' })
        expect(result.success).toBe(true)
        expect(result.recipe.title).toBe('Updated Pasta')
    })
})

describe('deleteRecipe', () => {
    it('deletes a recipe and makes it unretrievable', () => {
        const { recipe } = addRecipe('alice', validRecipe)
        expect(deleteRecipe(recipe.id, 'alice').success).toBe(true)
        expect(getRecipe(recipe.id)).toBeUndefined()
    })
})

describe('getRecipe', () => {
    it('returns the recipe by id or undefined', () => {
        expect(getRecipe(1)).toBeUndefined()
        const { recipe } = addRecipe('alice', validRecipe)
        expect(getRecipe(recipe.id).title).toBe('Pasta')
    })
})

describe('getAllRecipes', () => {
    it('returns all added recipes', () => {
        expect(getAllRecipes()).toEqual([])
        addRecipe('alice', validRecipe)
        expect(getAllRecipes()).toHaveLength(1)
    })
})

describe('getRecipesByUser', () => {
    it('returns only recipes by the specified user', () => {
        addRecipe('alice', validRecipe)
        addRecipe('bob', { ...validRecipe, title: 'Salad' })
        expect(getRecipesByUser('alice')).toHaveLength(1)
        expect(getRecipesByUser('bob')).toHaveLength(1)
    })
})

describe('filterRecipes', () => {
    it('filters recipes by criteria', () => {
        const recipes = [
            { id: 1, title: 'Pasta', ingredients: ['noodles'], instructions: 'boil', prepTime: 20, difficulty: 'Easy', cost: 10, dietaryTags: ['Vegetarian'] },
            { id: 2, title: 'Steak', ingredients: ['beef'], instructions: 'grill', prepTime: 30, difficulty: 'Hard', cost: 25, dietaryTags: ['Red Meat'] },
        ]
        expect(filterRecipes(recipes, {})).toHaveLength(2)
        expect(filterRecipes(recipes, { title: 'pasta' })).toHaveLength(1)
        expect(filterRecipes(recipes, { difficulty: 'Easy' })).toHaveLength(1)
        expect(filterRecipes(recipes, { cost: 15 })).toHaveLength(1)
    })
})

describe('getFriendRecipes', () => {
    it('returns recipes created by friends', () => {
        addRecipe('bob', validRecipe)
        addRecipe('alice', { ...validRecipe, title: 'Mine' })
        getFriends.mockReturnValue(['bob'])
        const result = getFriendRecipes('alice')
        expect(result).toHaveLength(1)
        expect(result[0].createdBy).toBe('bob')
    })
})
