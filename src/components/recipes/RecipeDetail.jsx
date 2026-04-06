import './RecipeManagement.css'

function RecipeDetail({ recipe, currentUser, onClose, onEdit, onDelete }) {
    const isOwner = recipe.createdBy === currentUser

    const getDifficultyClass = (diff) => {
        switch (diff) {
            case 'Easy': return 'difficulty-easy'
            case 'Medium': return 'difficulty-medium'
            case 'Hard': return 'difficulty-hard'
            case 'Hell': return 'difficulty-hell'
            default: return ''
        }
    }

    const handleDelete = () => {
        if (window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) {
            onDelete(recipe.id)
        }
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <div className="recipe-detail-overlay" onClick={handleOverlayClick}>
            <div className="recipe-detail">
                {/* Header */}
                <div className="recipe-detail-header">
                    <h2>{recipe.title}</h2>
                    <button className="recipe-detail-close" onClick={onClose}>✕</button>
                </div>

                {/* Badges */}
                <div className="recipe-detail-badges">
                    {recipe.difficulty && (
                        <span className={`difficulty-badge ${getDifficultyClass(recipe.difficulty)}`}>
                            {recipe.difficulty}
                        </span>
                    )}
                    {recipe.dietaryTags && recipe.dietaryTags.map(tag => (
                        <span key={tag} className="recipe-tag">{tag}</span>
                    ))}
                </div>

                {/* Stats */}
                <div className="recipe-detail-stats">
                    <div className="stat-card">
                        <div className="stat-value">{recipe.prepTime ? `${recipe.prepTime}` : '—'}</div>
                        <div className="stat-label">Minutes</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{recipe.cost ? `$${Number(recipe.cost).toFixed(2)}` : '—'}</div>
                        <div className="stat-label">Cost</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{recipe.ingredients ? recipe.ingredients.length : 0}</div>
                        <div className="stat-label">Ingredients</div>
                    </div>
                </div>

                {/* Ingredients */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="recipe-detail-section">
                        <h3>🥘 Ingredients</h3>
                        <ul>
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Instructions */}
                {recipe.instructions && (
                    <div className="recipe-detail-section">
                        <h3>📋 Instructions</h3>
                        <div className="recipe-detail-instructions">{recipe.instructions}</div>
                    </div>
                )}

                {/* Footer */}
                <div className="recipe-detail-footer">
                    <span className="recipe-detail-author">Created by <strong>{recipe.createdBy}</strong></span>
                    {isOwner && (
                        <div className="recipe-detail-actions">
                            <button className="btn-card-action" onClick={() => onEdit(recipe)}>
                                ✏️ Edit
                            </button>
                            <button className="btn-card-action btn-card-delete" onClick={handleDelete}>
                                🗑 Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RecipeDetail
