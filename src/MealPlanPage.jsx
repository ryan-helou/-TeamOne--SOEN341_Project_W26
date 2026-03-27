import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './MealPlan.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/* ── Helpers ────────────────────────────────────── */

function getMonday(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    return d
}

function toISO(d) {
    return d.toISOString().slice(0, 10)
}

function shortDate(d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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
    const storedUser = localStorage.getItem('user')
    const currentUser = storedUser ? JSON.parse(storedUser).username : null

    const [monday, setMonday] = useState(() => getMonday(new Date()))
    const [plan, setPlan] = useState(null)
    const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Modal state
    const [pickerDay, setPickerDay] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [detailDay, setDetailDay] = useState(null)
    const [pickerSearch, setPickerSearch] = useState('')

    const weekStart = toISO(monday)
    const dates = weekDates(monday)
    const todayISO = toISO(new Date())

    /* ── Data fetching ──────────────────────────── */

    const fetchPlan = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`/mealplans/week/${weekStart}`)
            const data = await res.json()
            if (data.success) {
                setPlan(data.mealPlan)
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
            const res = await fetch('/recipes/mine')
            const data = await res.json()
            if (Array.isArray(data)) {
                setRecipes(data)
            }
        } catch {
            // non-critical
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

    /* ── Actions ────────────────────────────────── */

    const handleAssign = async (recipe) => {
        if (!pickerDay) return
        try {
            let data
            if (plan) {
                // Update existing plan
                const res = await fetch(`/mealplans/${plan.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ meals: { [pickerDay]: recipe.id } })
                })
                data = await res.json()
            } else {
                // Create new plan
                const res = await fetch('/mealplans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ weekStart, meals: { [pickerDay]: recipe.id } })
                })
                data = await res.json()
            }
            if (data.success) {
                setPickerDay(null)
                setPickerSearch('')
                setIsEditing(false)
                setSuccess(isEditing
                    ? `Swapped recipe on ${pickerDay} to "${recipe.title}"`
                    : `Assigned "${recipe.title}" to ${pickerDay}`)
                fetchPlan()
            } else {
                setError(data.message || 'Failed to assign meal')
            }
        } catch {
            setError('Could not connect to server')
        }
    }

    const handleRemove = async (day) => {
        if (!plan) return
        try {
            const res = await fetch(`/mealplans/${plan.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meals: { [day]: null } })
            })
            const data = await res.json()
            if (data.success) {
                setDetailDay(null)
                setSuccess(`Removed meal from ${day}`)
                fetchPlan()
            } else {
                setError(data.message || 'Failed to remove meal')
            }
        } catch {
            setError('Could not connect to server')
        }
    }

    const openPicker = (day, editing) => {
        setPickerDay(day)
        setIsEditing(editing)
        setPickerSearch('')
    }

    const openDetail = (day) => {
        setDetailDay(day)
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

    const handleLogout = async () => {
        try { await fetch('/logout') } catch { /* noop */ }
        localStorage.removeItem('user')
        navigate('/login')
    }

    /* ── Filtered recipes for picker ────────────── */

    const filteredPickerRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(pickerSearch.toLowerCase())
    )

    /* ── Get recipe for a day ───────────────────── */

    const getMeal = (day) => plan?.meals?.[day] || null

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
                <button className="week-nav-btn" onClick={prevWeek}>← Prev</button>
                <button className="week-nav-btn btn-today" onClick={goToday}>Today</button>
                <div className="week-label">
                    Week of {shortDate(monday)}
                    <span className="week-range">
                        {shortDate(dates[0])} – {shortDate(dates[6])}, {dates[6].getFullYear()}
                    </span>
                </div>
                <button className="week-nav-btn" onClick={nextWeek}>Next →</button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="mealplan-loading">
                    <div className="spinner"></div>
                    <span>Loading meal plan…</span>
                </div>
            ) : (
                <div className="meal-grid">
                    {DAYS.map((day, i) => {
                        const dateObj = dates[i]
                        const isToday = toISO(dateObj) === todayISO
                        const meal = getMeal(day)

                        return (
                            <div key={day} className={`meal-day ${isToday ? 'today' : ''}`}>
                                <div className="day-header">
                                    <span className="day-name">{day}</span>
                                    <span className="day-date">{shortDate(dateObj)}</span>
                                </div>

                                {meal ? (
                                    <div className="meal-cell-filled" onClick={() => openDetail(day)}>
                                        <span className="recipe-name">{meal.title}</span>
                                        {meal.prepTime && (
                                            <span className="recipe-meta">⏱ {meal.prepTime}m</span>
                                        )}
                                        <div className="cell-actions">
                                            <button
                                                className="btn-cell-edit"
                                                onClick={e => { e.stopPropagation(); openPicker(day, true) }}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-cell-remove"
                                                onClick={e => { e.stopPropagation(); handleRemove(day) }}
                                                title="Remove"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="meal-cell-empty" onClick={() => openPicker(day, false)}>
                                        <span className="plus-icon">+</span>
                                        <span className="add-label">Add meal</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── Recipe Picker Modal ──────────── */}
            {pickerDay && (
                <div className="picker-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setPickerDay(null); setPickerSearch(''); setIsEditing(false) } }}>
                    <div className="picker-modal">
                        <h2>{isEditing ? 'Swap Recipe' : 'Choose a Recipe'}</h2>
                        <div className="picker-subtitle">{pickerDay}</div>
                        <input
                            className="picker-search"
                            placeholder="Search your recipes…"
                            value={pickerSearch}
                            onChange={e => setPickerSearch(e.target.value)}
                            autoFocus
                        />
                        <div className="picker-list">
                            {filteredPickerRecipes.length === 0 ? (
                                <div className="picker-empty">
                                    {recipes.length === 0
                                        ? '🍽️ No recipes yet. Create one first!'
                                        : 'No recipes match your search.'}
                                </div>
                            ) : (
                                filteredPickerRecipes.map(recipe => (
                                    <div key={recipe.id} className="picker-item" onClick={() => handleAssign(recipe)}>
                                        <div className="picker-item-info">
                                            <div className="picker-item-title">{recipe.title}</div>
                                            <div className="picker-item-meta">
                                                {recipe.prepTime ? `⏱ ${recipe.prepTime}m` : ''}
                                                {recipe.difficulty ? ` · ${recipe.difficulty}` : ''}
                                                {recipe.cost ? ` · $${Number(recipe.cost).toFixed(2)}` : ''}
                                            </div>
                                        </div>
                                        <span className="assign-arrow">→</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="picker-close" onClick={() => { setPickerDay(null); setPickerSearch(''); setIsEditing(false) }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ── Meal Detail Modal ───────────── */}
            {detailDay && getMeal(detailDay) && (() => {
                const meal = getMeal(detailDay)
                return (
                    <div className="detail-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDetailDay(null) }}>
                        <div className="detail-modal">
                            <div className="detail-header">
                                <h2>{meal.title}</h2>
                                <button className="detail-close" onClick={() => setDetailDay(null)}>✕</button>
                            </div>

                            <div className="detail-day-label">{detailDay}</div>

                            <div className="detail-stats">
                                <div className="detail-stat-card">
                                    <div className="stat-value">{meal.prepTime || '—'}</div>
                                    <div className="stat-label">Minutes</div>
                                </div>
                                <div className="detail-stat-card">
                                    <div className="stat-value">{meal.cost ? `$${Number(meal.cost).toFixed(2)}` : '—'}</div>
                                    <div className="stat-label">Cost</div>
                                </div>
                                <div className="detail-stat-card">
                                    <div className="stat-value">{meal.ingredients?.length || 0}</div>
                                    <div className="stat-label">Ingredients</div>
                                </div>
                            </div>

                            {meal.difficulty && (
                                <div className="detail-badges">
                                    <span className={`difficulty-badge difficulty-${meal.difficulty.toLowerCase()}`}>
                                        {meal.difficulty}
                                    </span>
                                </div>
                            )}

                            {meal.ingredients && meal.ingredients.length > 0 && (
                                <div className="detail-section">
                                    <h3>🥘 Ingredients</h3>
                                    <ul>
                                        {meal.ingredients.map((ing, idx) => (
                                            <li key={idx}>{ing}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {meal.instructions && (
                                <div className="detail-section">
                                    <h3>📋 Instructions</h3>
                                    <div className="instructions-text">{meal.instructions}</div>
                                </div>
                            )}

                            <div className="detail-footer">
                                <span className="detail-author">Created by <strong>{meal.createdBy}</strong></span>
                                <div className="detail-actions">
                                    <button
                                        className="btn-detail-edit"
                                        onClick={() => { setDetailDay(null); openPicker(detailDay, true) }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn-detail-remove"
                                        onClick={() => handleRemove(detailDay)}
                                    >
                                        🗑 Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}

export default MealPlanPage
