import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RecipeCard from './RecipeCard'
import RecipeForm from './RecipeForm'
import RecipeDetail from './RecipeDetail'
import './RecipeManagement.css'

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Hell']
const DIETARY_TAGS = ['Vegan', 'Vegetarian', 'Fish', 'Red Meat', 'Dessert', 'High Protein', 'Low Calories']

// Map difficulty to a numeric level for comparison
function getDifficultyLevel(diff) {
    switch (diff) {
        case 'Easy': return 0
        case 'Medium': return 1
        case 'Hard': return 2
        case 'Hell': return 3
        default: return -1
    }
}

function RecipePage() {
    const navigate = useNavigate()
    const storedUser = localStorage.getItem('user')
    const currentUser = storedUser ? JSON.parse(storedUser).username : null

    // Recipe data
    const [allRecipes, setAllRecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Search
    const [searchTerm, setSearchTerm] = useState('')

    // Filters
    const [filterOpen, setFilterOpen] = useState(true)
    const [filterPrepTime, setFilterPrepTime] = useState('')
    const [filterDifficulty, setFilterDifficulty] = useState('')
    const [filterCost, setFilterCost] = useState('')
    const [filterTags, setFilterTags] = useState([])
    const [isFiltered, setIsFiltered] = useState(false)

    // Modals
    const [showForm, setShowForm] = useState(false)
    const [editingRecipe, setEditingRecipe] = useState(null)

    // Logout handler
    const handleLogout = async () => {
        try {
            await fetch('/logout')
            localStorage.removeItem('user')
            navigate('/login')
        } catch (err) {
            localStorage.removeItem('user')
            navigate('/login')
        }
    }
    const [viewingRecipe, setViewingRecipe] = useState(null)

    // Load recipes on mount
    useEffect(() => {
        fetchRecipes()
    }, [])

    // Clear success after 3s
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [success])

    const fetchRecipes = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/recipes/mine')
            const data = await res.json()
            setAllRecipes(data)
        } catch (err) {
            setError('Failed to load recipes')
        } finally {
            setLoading(false)
        }
    }

    // ---- Client-side filter + search ----
    const getFilteredRecipes = () => {
        let result = allRecipes

        // Search by title
        if (searchTerm) {
            result = result.filter(r =>
                r.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply filters only when isFiltered is true
        if (isFiltered) {
            if (filterPrepTime) {
                const maxTime = Number(filterPrepTime)
                result = result.filter(r => r.prepTime && r.prepTime <= maxTime)
            }
            if (filterDifficulty) {
                const maxDiff = getDifficultyLevel(filterDifficulty)
                result = result.filter(r =>
                    !r.difficulty || getDifficultyLevel(r.difficulty) <= maxDiff
                )
            }
            if (filterCost) {
                const maxCost = Number(filterCost)
                result = result.filter(r => r.cost && r.cost <= maxCost)
            }
            if (filterTags.length > 0) {
                result = result.filter(r =>
                    r.dietaryTags && filterTags.every(tag => r.dietaryTags.includes(tag))
                )
            }
        }

        return result
    }

    const displayedRecipes = getFilteredRecipes()

    const handleApplyFilter = () => {
        setIsFiltered(true)
    }

    const handleResetFilter = () => {
        setFilterPrepTime('')
        setFilterDifficulty('')
        setFilterCost('')
        setFilterTags([])
        setSearchTerm('')
        setIsFiltered(false)
    }

    const toggleFilterTag = (tag) => {
        setFilterTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    // ---- CRUD handlers ----
    const handleCreateSuccess = (newRecipe) => {
        setShowForm(false)
        setSuccess('Recipe created successfully!')
        fetchRecipes()
    }

    const handleEditClick = (recipe) => {
        setViewingRecipe(null)
        setEditingRecipe(recipe)
        setShowForm(true)
    }

    const handleEditSuccess = (updatedRecipe) => {
        setShowForm(false)
        setEditingRecipe(null)
        setSuccess('Recipe updated successfully!')
        fetchRecipes()
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/recipes/${id}`, { method: 'DELETE' })
            const data = await res.json()

            if (data.success) {
                setViewingRecipe(null)
                setSuccess('Recipe deleted successfully!')
                fetchRecipes()
            } else {
                setError(data.message || 'Delete failed')
            }
        } catch (err) {
            setError('Failed to delete recipe')
        }
    }

    const handleFormCancel = () => {
        setShowForm(false)
        setEditingRecipe(null)
    }

    return (
        <div className="recipe-page">
            {/* Top Bar */}
            <div className="recipe-topbar">
                <h1>🍳 Recipes</h1>

                <div className="recipe-search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        id="recipe-search"
                        type="text"
                        className="recipe-search"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="recipe-topbar-actions">
                    <button className="btn-back" onClick={handleLogout}>🚪 Logout</button>
                    <Link to="/profile" className="btn-back">👤 Profile</Link>
                    {currentUser && (
                        <button
                            id="btn-create-recipe"
                            className="btn-create"
                            onClick={() => { setEditingRecipe(null); setShowForm(true) }}
                        >
                            + Create Recipe
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            {error && <div className="recipe-error">{error}</div>}
            {success && <div className="recipe-success">{success}</div>}

            {/* Content: Sidebar + Grid */}
            <div className="recipe-content">
                {/* Filter Sidebar */}
                <aside className="filter-sidebar">
                    <div className="filter-header">
                        <h3>⚙ Filters</h3>
                        <button
                            className="btn-toggle-filter"
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            {filterOpen ? '▲' : '▼'}
                        </button>
                    </div>

                    <div className={`filter-body ${!filterOpen ? 'collapsed' : ''}`}>
                        {/* Max Prep Time */}
                        <div className="filter-group">
                            <label htmlFor="filter-prep-time">Max Prep Time (min)</label>
                            <input
                                id="filter-prep-time"
                                type="number"
                                min="1"
                                value={filterPrepTime}
                                onChange={(e) => setFilterPrepTime(e.target.value)}
                                placeholder="e.g. 30"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="filter-group">
                            <label htmlFor="filter-difficulty">Max Difficulty</label>
                            <select
                                id="filter-difficulty"
                                value={filterDifficulty}
                                onChange={(e) => setFilterDifficulty(e.target.value)}
                            >
                                <option value="">Any</option>
                                {DIFFICULTY_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        {/* Max Cost */}
                        <div className="filter-group">
                            <label htmlFor="filter-cost">Max Cost ($)</label>
                            <input
                                id="filter-cost"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={filterCost}
                                onChange={(e) => setFilterCost(e.target.value)}
                                placeholder="e.g. 15"
                            />
                        </div>

                        {/* Dietary Tags */}
                        <div className="filter-group">
                            <label>Dietary Tags</label>
                            <div className="filter-tags">
                                {DIETARY_TAGS.map(tag => (
                                    <span key={tag}>
                                        <input
                                            type="checkbox"
                                            id={`filter-tag-${tag}`}
                                            className="tag-checkbox"
                                            checked={filterTags.includes(tag)}
                                            onChange={() => toggleFilterTag(tag)}
                                        />
                                        <label htmlFor={`filter-tag-${tag}`} className="tag-label">
                                            {tag}
                                        </label>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Filter actions */}
                        <div className="filter-actions">
                            <button id="btn-apply-filter" className="btn-apply-filter" onClick={handleApplyFilter}>
                                Apply
                            </button>
                            <button id="btn-reset-filter" className="btn-reset-filter" onClick={handleResetFilter}>
                                Reset
                            </button>
                        </div>

                        {isFiltered && (
                            <div style={{ fontSize: '0.8rem', color: '#667eea', marginTop: '0.5rem', textAlign: 'center' }}>
                                Showing filtered results
                            </div>
                        )}
                    </div>
                </aside>

                {/* Recipe Grid */}
                <div className="recipe-grid">
                    {loading ? (
                        <div className="recipe-loading">
                            <div className="spinner"></div>
                            <span>Loading recipes...</span>
                        </div>
                    ) : displayedRecipes.length === 0 ? (
                        <div className="recipe-empty">
                            <span className="empty-icon">🍽️</span>
                            {isFiltered || searchTerm
                                ? 'No recipes match your search or filters.'
                                : 'No recipes yet. Create the first one!'}
                        </div>
                    ) : (
                        displayedRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                currentUser={currentUser}
                                onView={setViewingRecipe}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <RecipeForm
                    recipe={editingRecipe}
                    onSubmit={editingRecipe ? handleEditSuccess : handleCreateSuccess}
                    onCancel={handleFormCancel}
                />
            )}

            {/* Detail View */}
            {viewingRecipe && (
                <RecipeDetail
                    recipe={viewingRecipe}
                    currentUser={currentUser}
                    onClose={() => setViewingRecipe(null)}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}

export default RecipePage
