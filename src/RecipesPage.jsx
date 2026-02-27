import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RecipeCreate from './RecipeCreate'
import RecipeEdit from './RecipeEdit'
import './ProfileManagement.css'

function RecipeCard({ recipe, currentUser, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isOwner = currentUser && recipe.createdBy === currentUser

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{recipe.title}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {recipe.prepTime ? (
            <span><span style={{ color: '#999' }}>Prep:</span> <span style={{ color: '#fff' }}>{recipe.prepTime} min</span></span>
          ) : null}
          {recipe.difficulty ? (
            <span><span style={{ color: '#999' }}>Difficulty:</span> <span style={{ color: '#fff' }}>{recipe.difficulty}</span></span>
          ) : null}
          {recipe.cost ? (
            <span><span style={{ color: '#999' }}>Cost:</span> <span style={{ color: '#fff' }}>${recipe.cost}</span></span>
          ) : null}
        </div>
        {recipe.createdBy ? (
          <span style={{ color: '#999' }}>By: <span style={{ color: '#bbb' }}>{recipe.createdBy}</span></span>
        ) : null}
      </div>

      {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {recipe.dietaryTags.map(tag => (
            <span key={tag} style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.6rem',
              background: 'rgba(102,126,234,0.15)',
              border: '1px solid rgba(102,126,234,0.3)',
              borderRadius: '2rem',
              color: '#a5b4fc'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <p style={{ margin: 0, fontSize: '0.9rem', color: '#bbb', lineHeight: 1.5 }}>
        {recipe.instructions.length > 120
          ? recipe.instructions.slice(0, 120) + '...'
          : recipe.instructions}
      </p>

      {isOwner && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
          {confirmDelete ? (
            <>
              <span style={{ fontSize: '0.85rem', color: '#ff6b6b', alignSelf: 'center', flex: 1 }}>
                Delete this recipe?
              </span>
              <button
                onClick={() => onDelete(recipe.id)}
                className="btn-cancel"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="btn-edit"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(recipe)}
                className="btn-edit"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="btn-cancel"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function RecipesPage() {
  const [view, setView] = useState('list')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [editingRecipe, setEditingRecipe] = useState(null)
  const navigate = useNavigate()

  const storedUser = localStorage.getItem('user')
  const currentUser = storedUser ? JSON.parse(storedUser).username : null

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const res = await fetch('/recipes')
      const data = await res.json()
      setRecipes(data)
    } catch {
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = (newRecipe) => {
    setRecipes(prev => [...prev, newRecipe])
    showSuccess(`"${newRecipe.title}" was added successfully!`)
    setView('list')
  }

  const handleEditClick = (recipe) => {
    setEditingRecipe(recipe)
    setView('edit')
  }

  const handleEditSuccess = (updatedRecipe) => {
    setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r))
    showSuccess(`"${updatedRecipe.title}" was updated successfully!`)
    setEditingRecipe(null)
    setView('list')
  }

  const handleDelete = async (id) => {
    const res = await fetch(`/recipes/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      const deleted = recipes.find(r => r.id === id)
      setRecipes(prev => prev.filter(r => r.id !== id))
      showSuccess(`"${deleted?.title}" was deleted.`)
    }
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 4000)
  }

  if (view === 'create') {
    return (
      <RecipeCreate
        onCancel={() => setView('list')}
        onSaveSuccess={handleCreateSuccess}
      />
    )
  }

  if (view === 'edit' && editingRecipe) {
    return (
      <RecipeEdit
        recipe={editingRecipe}
        onCancel={() => { setEditingRecipe(null); setView('list') }}
        onSaveSuccess={handleEditSuccess}
      />
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Recipes</h1>
        <div className="profile-actions">
          <button onClick={() => setView('create')} className="btn-save">
            + New Recipe
          </button>
          <button onClick={() => navigate('/profile')} className="btn-edit">
            My Profile
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="success-message" style={{ marginBottom: '1.5rem' }}>
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="profile-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#999', fontSize: '1.1rem' }}>No recipes yet. Be the first to add one!</p>
          <button onClick={() => setView('create')} className="btn-save" style={{ marginTop: '1rem' }}>
            + New Recipe
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              currentUser={currentUser}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipesPage
