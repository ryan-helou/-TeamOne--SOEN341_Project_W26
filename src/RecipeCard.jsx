import './RecipeManagement.css'

function RecipeCard({ recipe, currentUser, onView, onEdit, onDelete }) {
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

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(recipe)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) {
      onDelete(recipe.id)
    }
  }

  return (
    <div className="recipe-card" onClick={() => onView(recipe)} id={`recipe-card-${recipe.id}`}>
      <div className="recipe-card-header">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {recipe.difficulty && (
          <span className={`difficulty-badge ${getDifficultyClass(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        )}
      </div>

      <div className="recipe-card-meta">
        {recipe.prepTime && (
          <span>⏱ {recipe.prepTime} min</span>
        )}
        {recipe.cost && (
          <span>💲{Number(recipe.cost).toFixed(2)}</span>
        )}
      </div>

      {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
        <div className="recipe-card-tags">
          {recipe.dietaryTags.map(tag => (
            <span key={tag} className="recipe-tag">{tag}</span>
          ))}
        </div>
      )}

      {recipe.instructions && (
        <div className="recipe-card-preview">
          {recipe.instructions}
        </div>
      )}

      <div className="recipe-card-footer">
        <span className="recipe-card-author">👤 {recipe.createdBy}</span>
        {isOwner && (
          <div className="recipe-card-actions">
            <button className="btn-card-action" onClick={handleEdit}>✏️ Edit</button>
            <button className="btn-card-action btn-card-delete" onClick={handleDelete}>🗑 Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeCard
