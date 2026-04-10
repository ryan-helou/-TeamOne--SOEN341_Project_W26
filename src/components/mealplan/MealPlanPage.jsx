import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './MealPlan.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner']
const MEAL_EMOJI = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' }

/* ── Helpers ────────────────────────────────────── */

/** Return the Monday of the week that contains `date`. */
function getMonday(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    return d
}

/** Format a Date as YYYY-MM-DD. */
function toISO(d) {
    return d.toISOString().slice(0, 10)
}

/** Format a Date as "Mar 24". */
function shortDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Return an array of 7 Date objects starting from monday. */
function weekDates(monday) {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(d.getDate() + i)
        return d
    })
}

/* ── Main Component ─────────────────────────────── */
function MealPlanPage() {
    const navigate = useNavigate()

    // Current week anchor (always a Monday)
    const [monday, setMonday] = useState(() => getMonday(new Date()))
    const [plan, setPlan] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [pickerError, setPickerError] = useState('')   // error shown inside picker modal

    // Modal state
    const [pickerSlot, setPickerSlot] = useState(null)   // { day, mealType }
    const [detailSlot, setDetailSlot] = useState(null)    // { day, mealType, recipe }
    const [pickerSearch, setPickerSearch] = useState('')

    const weekStart = toISO(monday)
    const dates = weekDates(monday)
    const todayISO = toISO(new Date())

    /* ── Data fetching ──────────────────────────── */

    const fetchPlan = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`/meal-plan?week=${weekStart}`)
            const data = await res.json()
            if (data.success) {
                setPlan(data.plan)
            } else {
                setError(data.message || 'Failed to load meal plan')
            }
        } catch {
            setError('Could not connect to server')
        } finally {
            setLoading(false)
        }
    }, [weekStart])

    const fetchRecipes = useCallback(async () => {
        try {
            const res = await fetch('/recipes/all')
            const data = await res.json()
            if (data.success && Array.isArray(data.recipes)) {
                setRecipes(data.recipes)
            }
        } catch {
            // recipes list is non-critical
        }
    }, [])

    useEffect(() => { fetchPlan() }, [fetchPlan])
    useEffect(() => { fetchRecipes() }, [fetchRecipes])

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => setSuccess(''), 3000)
            return () => clearTimeout(t)
        }
    }, [success])

    useEffect(() => {
        if (error) {
            const t = setTimeout(() => setError(''), 5000)
            return () => clearTimeout(t)
        }
    }, [error])

    /* ── Actions ────────────────────────────────── */

    /* ── Duplicate detection helper ──────────── */
    /** Returns a Set of recipeIds already used in the current week's plan. */
    const usedRecipeIds = (() => {
        const ids = new Set()
        if (!plan?.meals) return ids
        for (const day of DAYS) {
            for (const mt of MEAL_TYPES) {
                const slot = plan.meals[day]?.[mt]
                if (slot?.recipeId != null) ids.add(slot.recipeId)
            }
        }
        return ids
    })()

    const handleAssign = async (recipe) => {
        if (!pickerSlot) return

        // Client-side duplicate guard
        if (usedRecipeIds.has(recipe.id)) {
            setPickerError(`"${recipe.title}" is already in your meal plan this week!`)
            return
        }

        setPickerError('')
        try {
            const res = await fetch('/meal-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    weekStart,
                    day: pickerSlot.day,
                    mealType: pickerSlot.mealType,
                    recipeId: recipe.id
                })
            })
            const data = await res.json()
            if (data.success) {
                setPlan(data.plan)
                setPickerSlot(null)
                setPickerSearch('')
                setPickerError('')
                setSuccess(`Assigned "${recipe.title}" to ${pickerSlot.day} ${pickerSlot.mealType}`)
            } else {
                // Show duplicate / other error inside the picker so user sees it
                setPickerError(data.message || 'Failed to assign meal')
            }
        } catch {
            setPickerError('Could not connect to server')
        }
    }

    const handleRemove = async (day, mealType) => {
        try {
            const res = await fetch('/meal-plan', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weekStart, day, mealType })
            })
            const data = await res.json()
            if (data.success) {
                setPlan(data.plan)
                setDetailSlot(null)
                setSuccess(`Removed meal from ${day} ${mealType}`)
            } else {
                setError(data.message || 'Failed to remove meal')
            }
        } catch {
            setError('Could not connect to server')
        }
    }

    const handleCellClick = (day, mealType) => {
        setPickerError('')
        const meal = plan?.meals?.[day]?.[mealType]
        if (meal) {
            // Look up full recipe data if we have it
            const fullRecipe = recipes.find(r => r.id === meal.recipeId)
            setDetailSlot({ day, mealType, meal, fullRecipe })
        } else {
            setPickerSlot({ day, mealType })
            setPickerSearch('')
        }
    }

    /* ── Week navigation ────────────────────────── */

    const prevWeek = () => {
        const d = new Date(monday)
        d.setDate(d.getDate() - 7)
        setMonday(d)
    }
    const nextWeek = () => {
        const d = new Date(monday)
        d.setDate(d.getDate() + 7)
        setMonday(d)
    }
    const goToday = () => setMonday(getMonday(new Date()))

    /* ── Logout ─────────────────────────────────── */

    const handleLogout = async () => {
        try { await fetch('/logout') } catch { /* noop */ }
        localStorage.removeItem('user')
        navigate('/login')
    }

    /* ── Filtered recipes for picker ────────────── */

    const filteredPickerRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(pickerSearch.toLowerCase())
    )

    /* ── Render ──────────────────────────────────── */

    return (
        <div className="mealplan-page">
            {/* Top Bar */}
            <div className="mealplan-topbar">
                <h1>📅 Meal Plan</h1>
                <div className="mealplan-topbar-actions">
                    <Link to="/recipes" className="btn-back">🍳 Recipes</Link>
                    <Link to="/profile" className="btn-back">👤 Profile</Link>
                    <button className="btn-back" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </div>

            {/* Messages */}
            {error && <div className="mealplan-error">{error}</div>}
            {success && <div className="mealplan-success">{success}</div>}

            {/* Week Navigator */}
            <div className="week-navigator">
                <button onClick={prevWeek}>← Prev</button>
                <button className="btn-today" onClick={goToday}>Today</button>
                <div className="week-label">
                    Week of {shortDate(monday)}
                    <span className="week-range">
                        {shortDate(dates[0])} – {shortDate(dates[6])}, {dates[6].getFullYear()}
                    </span>
                </div>
                <button onClick={nextWeek}>Next →</button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="mealplan-loading">
                    <div className="spinner"></div>
                    <span>Loading meal plan…</span>
                </div>
            ) : (
                <div className="meal-grid">
                    {/* Header row */}
                    <div className="grid-header corner"></div>
                    {DAYS.map((day, i) => {
                        const dateObj = dates[i]
                        const isToday = toISO(dateObj) === todayISO
                        return (
                            <div key={day} className={`grid-header ${isToday ? 'today' : ''}`}>
                                {day}
                                <span className="header-date">{shortDate(dateObj)}</span>
                            </div>
                        )
                    })}

                    {/* Body rows */}
                    {MEAL_TYPES.map(mealType => (
                        <>
                            <div key={`label-${mealType}`} className="row-label">
                                {MEAL_EMOJI[mealType]} {mealType}
                            </div>
                            {DAYS.map((day, i) => {
                                const meal = plan?.meals?.[day]?.[mealType]
                                const isToday = toISO(dates[i]) === todayISO
                                return (
                                    <div
                                        key={`${day}-${mealType}`}
                                        className={`meal-cell ${isToday ? 'today-col' : ''}`}
                                        onClick={() => handleCellClick(day, mealType)}
                                        id={`cell-${day}-${mealType}`}
                                    >
                                        {meal ? (
                                            <div className="meal-cell-filled">
                                                <span className="meal-emoji">{MEAL_EMOJI[mealType]}</span>
                                                <span className="recipe-name">{meal.recipeTitle}</span>
                                                <button
                                                    className="btn-remove-meal"
                                                    onClick={e => { e.stopPropagation(); handleRemove(day, mealType) }}
                                                    title="Remove"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="meal-cell-empty">
                                                <span className="plus-icon">+</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </>
                    ))}
                </div>
            )}

            {/* ── Recipe Picker Modal ──────────── */}
            {pickerSlot && (
                <div className="picker-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setPickerSlot(null); setPickerSearch('') } }}>
                    <div className="picker-modal">
                        <h2>Choose a Recipe</h2>
                        <div className="picker-subtitle">
                            {pickerSlot.day} · {pickerSlot.mealType}
                        </div>
                        <input
                            className="picker-search"
                            placeholder="Search your recipes…"
                            value={pickerSearch}
                            onChange={e => setPickerSearch(e.target.value)}
                            autoFocus
                        />
                        {pickerError && (
                            <div className="picker-error" id="picker-duplicate-error">
                                ⚠️ {pickerError}
                            </div>
                        )}
                        <div className="picker-list">
                            {filteredPickerRecipes.length === 0 ? (
                                <div className="picker-empty">
                                    {recipes.length === 0
                                        ? '🍽️ No recipes yet. Create one first!'
                                        : 'No recipes match your search.'}
                                </div>
                            ) : (
                                filteredPickerRecipes.map(recipe => {
                                    const isDuplicate = usedRecipeIds.has(recipe.id)
                                    return (
                                    <div
                                        key={recipe.id}
                                        className={`picker-item ${isDuplicate ? 'picker-item-disabled' : ''}`}
                                        onClick={() => !isDuplicate && handleAssign(recipe)}
                                        title={isDuplicate ? 'Already in your plan this week' : ''}
                                    >
                                        <div className="picker-item-info">
                                            <div className="picker-item-title">
                                                {recipe.title}
                                                {isDuplicate && <span className="duplicate-badge">Already Planned</span>}
                                            </div>
                                            <div className="picker-item-meta">
                                                {recipe.prepTime ? `⏱ ${recipe.prepTime}m` : ''}
                                                {recipe.difficulty ? ` · ${recipe.difficulty}` : ''}
                                                {recipe.cost ? ` · $${Number(recipe.cost).toFixed(2)}` : ''}
                                            </div>
                                        </div>
                                        <span className="assign-arrow">→</span>
                                    </div>
                                    )
                                })
                            )}
                        </div>
                        <button className="picker-close" onClick={() => { setPickerSlot(null); setPickerSearch(''); setPickerError('') }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ── Meal Detail Modal ───────────── */}
            {detailSlot && (
                <div className="meal-detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDetailSlot(null) }}>
                    <div className="meal-detail-modal">
                        <div className="detail-header">
                            <h2>{detailSlot.meal.recipeTitle}</h2>
                            <button className="detail-close" onClick={() => setDetailSlot(null)}>✕</button>
                        </div>

                        <div className="detail-slot">
                            <span>{detailSlot.day}</span>
                            <span>{detailSlot.mealType}</span>
                        </div>

                        {detailSlot.fullRecipe ? (
                            <>
                                <div className="detail-stats">
                                    <div className="detail-stat-card">
                                        <div className="stat-value">{detailSlot.fullRecipe.prepTime || '—'}</div>
                                        <div className="stat-label">Minutes</div>
                                    </div>
                                    <div className="detail-stat-card">
                                        <div className="stat-value">{detailSlot.fullRecipe.cost ? `$${Number(detailSlot.fullRecipe.cost).toFixed(2)}` : '—'}</div>
                                        <div className="stat-label">Cost</div>
                                    </div>
                                    <div className="detail-stat-card">
                                        <div className="stat-value">{detailSlot.fullRecipe.ingredients?.length || 0}</div>
                                        <div className="stat-label">Ingredients</div>
                                    </div>
                                </div>

                                {detailSlot.fullRecipe.ingredients?.length > 0 && (
                                    <div className="detail-section">
                                        <h3>🥘 Ingredients</h3>
                                        <ul>
                                            {detailSlot.fullRecipe.ingredients.map((ing, idx) => (
                                                <li key={idx}>{ing}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {detailSlot.fullRecipe.instructions && (
                                    <div className="detail-section">
                                        <h3>📋 Instructions</h3>
                                        <div className="instructions-text">{detailSlot.fullRecipe.instructions}</div>
                                    </div>
                                )}

                                <div className="detail-footer">
                                    <span className="author">Created by <strong>{detailSlot.fullRecipe.createdBy}</strong></span>
                                    <button
                                        className="btn-remove-from-plan"
                                        onClick={() => handleRemove(detailSlot.day, detailSlot.mealType)}
                                    >
                                        🗑 Remove from Plan
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="detail-footer">
                                <span className="author" style={{ color: '#888' }}>Recipe details unavailable (recipe may have been deleted)</span>
                                <button
                                    className="btn-remove-from-plan"
                                    onClick={() => handleRemove(detailSlot.day, detailSlot.mealType)}
                                >
                                    🗑 Remove from Plan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MealPlanPage
