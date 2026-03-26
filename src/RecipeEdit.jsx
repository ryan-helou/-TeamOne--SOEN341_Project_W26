import { useState } from 'react'
import './ProfileManagement.css'

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']
const DIETARY_TAGS = ['Vegan', 'Vegetarian', 'Fish', 'Red Meat', 'Dessert', 'High Protein', 'Low Calories']

function RecipeEdit({ recipe, onCancel, onSaveSuccess }) {
  const [title, setTitle] = useState(recipe.title)
  const [ingredientInput, setIngredientInput] = useState('')
  const [ingredients, setIngredients] = useState([...recipe.ingredients])
  const [instructions, setInstructions] = useState(recipe.instructions)
  const [prepTime, setPrepTime] = useState(recipe.prepTime ?? '')
  const [difficulty, setDifficulty] = useState(recipe.difficulty ?? '')
  const [cost, setCost] = useState(recipe.cost ?? '')
  const [dietary, setDietary] = useState([...(recipe.dietaryTags ?? [])])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addIngredient = () => {
    const trimmed = ingredientInput.trim()
    if (!trimmed) return
    setIngredients([...ingredients, trimmed])
    setIngredientInput('')
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleIngredientKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  const toggleDietaryTag = (tag) => {
    setDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.')
      return
    }

    setSaving(true)
    try {
      const body = {
        title,
        ingredients,
        instructions,
        ...(prepTime !== '' && { prepTime: Number(prepTime) }),
        ...(difficulty !== '' && { difficulty }),
        ...(cost !== '' && { cost: Number(cost) }),
        dietary,
      }

      const res = await fetch(`/recipes/${recipe.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (data.success) {
        onSaveSuccess(data.recipe)
      } else {
        setError(data.message || 'Failed to update recipe.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Edit Recipe</h1>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message">{error}</div>}

          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Info</h3>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="instructions">Instructions</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows="5"
                required
                disabled={saving}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-section">
            <h3>Ingredients</h3>

            <div className="form-group">
              <label>Add Ingredient</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={e => setIngredientInput(e.target.value)}
                  onKeyDown={handleIngredientKeyDown}
                  placeholder="e.g., 2 cups flour"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={addIngredient}
                  className="btn-edit"
                  disabled={saving || !ingredientInput.trim()}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Add
                </button>
              </div>
              <small className="form-hint">Press Enter or click Add to add each ingredient</small>
            </div>

            {ingredients.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {ingredients.map((ing, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span>{ing}</span>
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      disabled={saving}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        lineHeight: 1
                      }}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Details */}
          <div className="form-section">
            <h3>Details</h3>

            <div className="form-group">
              <label htmlFor="prepTime">Prep Time (minutes)</label>
              <input
                id="prepTime"
                type="number"
                min="1"
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                disabled={saving}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  color: difficulty ? 'white' : '#999',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select difficulty</option>
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level} value={level} style={{ background: '#1a1a2e', color: 'white' }}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cost">Estimated Cost ($)</label>
              <input
                id="cost"
                type="number"
                min="0.01"
                step="0.01"
                value={cost}
                onChange={e => setCost(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="form-section">
            <h3>Dietary Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {DIETARY_TAGS.map(tag => (
                <label
                  key={tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.75rem',
                    background: dietary.includes(tag) ? 'rgba(102,126,234,0.2)' : 'rgba(255,255,255,0.05)',
                    border: dietary.includes(tag) ? '1px solid #667eea' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={dietary.includes(tag)}
                    onChange={() => toggleDietaryTag(tag)}
                    disabled={saving}
                    style={{ display: 'none' }}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel" disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecipeEdit
