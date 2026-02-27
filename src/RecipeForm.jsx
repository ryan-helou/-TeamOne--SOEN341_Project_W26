import { useState, useEffect } from 'react'
import './RecipeManagement.css'

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Hell']
const DIETARY_TAGS = ['Vegan', 'Vegetarian', 'Fish', 'Red Meat', 'Dessert', 'High Protein', 'Low Calories']

function RecipeForm({ recipe, onSubmit, onCancel }) {
    const isEditing = !!recipe

    const [title, setTitle] = useState('')
    const [ingredients, setIngredients] = useState([''])
    const [instructions, setInstructions] = useState('')
    const [prepTime, setPrepTime] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [cost, setCost] = useState('')
    const [dietary, setDietary] = useState([])
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (recipe) {
            setTitle(recipe.title || '')
            setIngredients(recipe.ingredients && recipe.ingredients.length > 0 ? [...recipe.ingredients] : [''])
            setInstructions(recipe.instructions || '')
            setPrepTime(recipe.prepTime || '')
            setDifficulty(recipe.difficulty || '')
            setCost(recipe.cost || '')
            setDietary(recipe.dietaryTags ? [...recipe.dietaryTags] : [])
        }
    }, [recipe])

    const addIngredient = () => {
        setIngredients([...ingredients, ''])
    }

    const removeIngredient = (index) => {
        if (ingredients.length === 1) return
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const updateIngredient = (index, value) => {
        const updated = [...ingredients]
        updated[index] = value
        setIngredients(updated)
    }

    const toggleDietaryTag = (tag) => {
        if (dietary.includes(tag)) {
            setDietary(dietary.filter(t => t !== tag))
        } else {
            setDietary([...dietary, tag])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate
        if (!title.trim()) {
            setError('Recipe title is required')
            return
        }

        const filledIngredients = ingredients.filter(i => i.trim())
        if (filledIngredients.length === 0) {
            setError('At least one ingredient is required')
            return
        }

        if (!instructions.trim()) {
            setError('Instructions are required')
            return
        }

        const payload = {
            title: title.trim(),
            ingredients: filledIngredients.map(i => i.trim()),
            instructions: instructions.trim(),
        }

        if (prepTime) payload.prepTime = Number(prepTime)
        if (difficulty) payload.difficulty = difficulty
        if (cost) payload.cost = Number(cost)
        if (dietary.length > 0) payload.dietary = dietary

        setSubmitting(true)

        try {
            const url = isEditing ? `/recipes/${recipe.id}` : '/recipes'
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (data.success) {
                onSubmit(data.recipe)
            } else {
                setError(data.message || 'Something went wrong')
            }
        } catch (err) {
            setError('Network error. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onCancel()
    }

    return (
        <div className="recipe-modal-overlay" onClick={handleOverlayClick}>
            <div className="recipe-modal">
                <h2>{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</h2>

                {error && <div className="recipe-error">{error}</div>}

                <form className="recipe-form" onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="form-group">
                        <label>📝 Title</label>
                        <input
                            id="recipe-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your recipe a name..."
                        />
                    </div>

                    {/* Ingredients */}
                    <div className="form-group">
                        <label>🥘 Ingredients</label>
                        <div className="ingredient-list">
                            {ingredients.map((ing, idx) => (
                                <div className="ingredient-row" key={idx}>
                                    <input
                                        type="text"
                                        value={ing}
                                        onChange={(e) => updateIngredient(idx, e.target.value)}
                                        placeholder={`Ingredient ${idx + 1}`}
                                    />
                                    {ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn-remove-ingredient"
                                            onClick={() => removeIngredient(idx)}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="btn-add-ingredient" onClick={addIngredient}>
                                + Add ingredient
                            </button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="form-group">
                        <label>📋 Instructions</label>
                        <textarea
                            id="recipe-instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Describe how to prepare this dish..."
                            rows={4}
                        />
                    </div>

                    {/* Prep Time & Cost */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>⏱ Prep Time (min)</label>
                            <input
                                id="recipe-prep-time"
                                type="number"
                                min="1"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                                placeholder="e.g. 30"
                            />
                        </div>
                        <div className="form-group">
                            <label>💲 Cost ($)</label>
                            <input
                                id="recipe-cost"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                placeholder="e.g. 12.50"
                            />
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="form-group">
                        <label>🎯 Difficulty</label>
                        <select
                            id="recipe-difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="">Select difficulty...</option>
                            {DIFFICULTY_LEVELS.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dietary Tags */}
                    <div className="form-group">
                        <label>🏷 Dietary Tags</label>
                        <div className="dietary-tags-form">
                            {DIETARY_TAGS.map(tag => (
                                <span key={tag}>
                                    <input
                                        type="checkbox"
                                        id={`dietary-${tag}`}
                                        className="tag-checkbox"
                                        checked={dietary.includes(tag)}
                                        onChange={() => toggleDietaryTag(tag)}
                                    />
                                    <label htmlFor={`dietary-${tag}`} className="tag-label">
                                        {tag}
                                    </label>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button type="button" className="btn-modal-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-modal-submit" disabled={submitting}>
                            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RecipeForm
