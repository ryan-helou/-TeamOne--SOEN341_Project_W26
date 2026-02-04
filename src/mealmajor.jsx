import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, Edit2, Trash2, User, LogOut, ChefHat, Clock, DollarSign, Utensils } from 'lucide-react';

// Main App Component
export default function MealMajor() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersData = await window.storage.get('users', true);
      const recipesData = await window.storage.get('recipes', true);
      const mealPlansData = await window.storage.get('mealPlans', true);
      
      if (usersData) setUsers(JSON.parse(usersData.value));
      if (recipesData) setRecipes(JSON.parse(recipesData.value));
      if (mealPlansData) setMealPlans(JSON.parse(mealPlansData.value));
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }
  };

  const saveUsers = async (updatedUsers) => {
    setUsers(updatedUsers);
    await window.storage.set('users', JSON.stringify(updatedUsers), true);
  };

  const saveRecipes = async (updatedRecipes) => {
    setRecipes(updatedRecipes);
    await window.storage.set('recipes', JSON.stringify(updatedRecipes), true);
  };

  const saveMealPlans = async (updatedPlans) => {
    setMealPlans(updatedPlans);
    await window.storage.set('mealPlans', JSON.stringify(updatedPlans), true);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setView('recipes');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  const handleRegister = (newUser) => {
    const updatedUsers = [...users, { ...newUser, id: Date.now() }];
    saveUsers(updatedUsers);
  };

  const handleUpdateProfile = (updatedUser) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
  };

  const handleAddRecipe = (recipe) => {
    const newRecipe = { ...recipe, id: Date.now(), createdBy: currentUser.id };
    saveRecipes([...recipes, newRecipe]);
  };

  const handleUpdateRecipe = (updatedRecipe) => {
    const updatedRecipes = recipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r);
    saveRecipes(updatedRecipes);
  };

  const handleDeleteRecipe = (recipeId) => {
    const updatedRecipes = recipes.filter(r => r.id !== recipeId);
    saveRecipes(updatedRecipes);
  };

  const handleUpdateMealPlan = (weekId, updatedPlan) => {
    const existingPlan = mealPlans.find(p => p.userId === currentUser.id && p.weekId === weekId);
    let updatedPlans;
    
    if (existingPlan) {
      updatedPlans = mealPlans.map(p => 
        p.userId === currentUser.id && p.weekId === weekId ? updatedPlan : p
      );
    } else {
      updatedPlans = [...mealPlans, updatedPlan];
    }
    
    saveMealPlans(updatedPlans);
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} users={users} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">MealMajor</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button
              onClick={() => setView('recipes')}
              className={`px-4 py-2 rounded-lg transition ${view === 'recipes' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-100'}`}
            >
              Recipes
            </button>
            <button
              onClick={() => setView('planner')}
              className={`px-4 py-2 rounded-lg transition ${view === 'planner' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-100'}`}
            >
              Meal Planner
            </button>
            <button
              onClick={() => setView('profile')}
              className={`px-4 py-2 rounded-lg transition ${view === 'profile' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-100'}`}
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:bg-red-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'recipes' && (
          <RecipeManagement
            recipes={recipes}
            currentUser={currentUser}
            onAddRecipe={handleAddRecipe}
            onUpdateRecipe={handleUpdateRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        )}
        {view === 'planner' && (
          <MealPlanner
            recipes={recipes}
            currentUser={currentUser}
            mealPlans={mealPlans}
            onUpdateMealPlan={handleUpdateMealPlan}
          />
        )}
        {view === 'profile' && (
          <ProfileManagement
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>
    </div>
  );
}

// Auth Screen Component
function AuthScreen({ onLogin, onRegister, users }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dietPreferences: [],
    allergies: []
  });
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isLogin) {
      // Check if account is locked due to too many failed attempts
      const attempts = failedAttempts[formData.email] || 0;
      if (attempts >= 5) {
        setError('Account temporarily locked due to too many failed attempts. Please try again later.');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Find user and validate password
      const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      
      if (!user) {
        setError('No account found with this email');
        // Track failed attempt
        setFailedAttempts({
          ...failedAttempts,
          [formData.email]: attempts + 1
        });
        return;
      }

      if (user.password !== formData.password) {
        const newAttempts = attempts + 1;
        setFailedAttempts({
          ...failedAttempts,
          [formData.email]: newAttempts
        });
        setError(`Invalid password. ${5 - newAttempts} attempts remaining.`);
        return;
      }

      // Successful login - reset failed attempts
      setFailedAttempts({
        ...failedAttempts,
        [formData.email]: 0
      });
      onLogin(user);
      
    } else {
      // Registration validation
      if (!formData.name || formData.name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        setError('An account with this email already exists');
        return;
      }

      // Successfully register
      onRegister({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.toLowerCase()
      });
      
      setSuccessMessage('Account created successfully! Please login.');
      setIsLogin(true);
      setFormData({ email: '', password: '', name: '', dietPreferences: [], allergies: [] });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ChefHat className="w-12 h-12 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">MealMajor</h1>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition ${isLogin ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition ${!isLogin ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">At least 2 characters</p>
            </div>
          )}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1 ml-1">At least 6 characters</p>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {isLogin && failedAttempts[formData.email] > 0 && failedAttempts[formData.email] < 5 && (
          <p className="text-xs text-gray-500 mt-4 text-center">
            Failed attempts: {failedAttempts[formData.email]}/5
          </p>
        )}
      </div>
    </div>
  );
}

// Profile Management Component
function ProfileManagement({ user, onUpdateProfile }) {
  const [formData, setFormData] = useState(user);
  const [newAllergy, setNewAllergy] = useState('');
  const [saved, setSaved] = useState(false);

  const dietOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Halal', 'Kosher'];

  const handleSave = () => {
    onUpdateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDiet = (diet) => {
    const prefs = formData.dietPreferences || [];
    if (prefs.includes(diet)) {
      setFormData({ ...formData, dietPreferences: prefs.filter(d => d !== diet) });
    } else {
      setFormData({ ...formData, dietPreferences: [...prefs, diet] });
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData({ 
        ...formData, 
        allergies: [...(formData.allergies || []), newAllergy.trim()] 
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy) => {
    setFormData({ 
      ...formData, 
      allergies: formData.allergies.filter(a => a !== allergy) 
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Preferences</label>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map(diet => (
              <button
                key={diet}
                onClick={() => toggleDiet(diet)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  (formData.dietPreferences || []).includes(diet)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              placeholder="Add allergy..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={addAllergy}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.allergies || []).map((allergy, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full">
                <span>{allergy}</span>
                <button onClick={() => removeAllergy(allergy)} className="hover:text-red-900">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          {saved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

// Recipe Management Component
function RecipeManagement({ recipes, currentUser, onAddRecipe, onUpdateRecipe, onDeleteRecipe }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    maxTime: '',
    difficulty: '',
    maxCost: '',
    dietaryTag: ''
  });

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTime = !filters.maxTime || recipe.prepTime <= parseInt(filters.maxTime);
    const matchesDifficulty = !filters.difficulty || recipe.difficulty === filters.difficulty;
    const matchesCost = !filters.maxCost || recipe.cost <= parseInt(filters.maxCost);
    const matchesDiet = !filters.dietaryTag || (recipe.dietaryTags || []).includes(filters.dietaryTag);

    return matchesSearch && matchesTime && matchesDifficulty && matchesCost && matchesDiet;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recipe Collection</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Recipe
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Time (min)</label>
            <input
              type="number"
              value={filters.maxTime}
              onChange={(e) => setFilters({ ...filters, maxTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Any"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Any</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Cost ($)</label>
            <input
              type="number"
              value={filters.maxCost}
              onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Any"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Tag</label>
            <select
              value={filters.dietaryTag}
              onChange={(e) => setFilters({ ...filters, dietaryTag: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Any</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Dairy-Free">Dairy-Free</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={() => setEditingRecipe(recipe)}
            onDelete={() => onDeleteRecipe(recipe.id)}
          />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No recipes found. Try adjusting your filters or add a new recipe!
        </div>
      )}

      {/* Add/Edit Recipe Modal */}
      {(showAddForm || editingRecipe) && (
        <RecipeForm
          recipe={editingRecipe}
          onSave={(recipe) => {
            if (editingRecipe) {
              onUpdateRecipe(recipe);
            } else {
              onAddRecipe(recipe);
            }
            setShowAddForm(false);
            setEditingRecipe(null);
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingRecipe(null);
          }}
        />
      )}
    </div>
  );
}

// Recipe Card Component
function RecipeCard({ recipe, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
          <div className="flex gap-2">
            <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>${recipe.cost}</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {(recipe.dietaryTags || []).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-2 font-semibold">Ingredients:</p>
        <ul className="text-sm text-gray-600 mb-3 list-disc list-inside">
          {recipe.ingredients.slice(0, 3).map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
          {recipe.ingredients.length > 3 && (
            <li className="text-gray-400">+ {recipe.ingredients.length - 3} more...</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Recipe Form Component
function RecipeForm({ recipe, onSave, onCancel }) {
  const [formData, setFormData] = useState(recipe || {
    name: '',
    ingredients: [''],
    prepTime: '',
    difficulty: 'Easy',
    cost: '',
    steps: [''],
    dietaryTags: []
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');

  const dietOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData({ ...formData, ingredients: [...formData.ingredients, newIngredient.trim()] });
      setNewIngredient('');
    }
  };

  const removeIngredient = (idx) => {
    setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== idx) });
  };

  const addStep = () => {
    if (newStep.trim()) {
      setFormData({ ...formData, steps: [...formData.steps, newStep.trim()] });
      setNewStep('');
    }
  };

  const removeStep = (idx) => {
    setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== idx) });
  };

  const toggleTag = (tag) => {
    const tags = formData.dietaryTags || [];
    if (tags.includes(tag)) {
      setFormData({ ...formData, dietaryTags: tags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, dietaryTags: [...tags, tag] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate recipe name
    if (!formData.name || formData.name.trim().length < 3) {
      alert('Recipe name must be at least 3 characters long');
      return;
    }

    // Validate prep time
    if (!formData.prepTime || formData.prepTime <= 0) {
      alert('Please enter a valid preparation time');
      return;
    }

    // Validate cost
    if (!formData.cost || formData.cost <= 0) {
      alert('Please enter a valid cost');
      return;
    }

    // Validate ingredients
    if (!formData.ingredients || formData.ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    // Validate steps
    if (!formData.steps || formData.steps.length === 0) {
      alert('Please add at least one preparation step');
      return;
    }

    onSave({ ...formData, id: recipe?.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {recipe ? 'Edit Recipe' : 'Add New Recipe'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prep Time (min)</label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cost ($)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {dietOptions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    (formData.dietaryTags || []).includes(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                placeholder="Add ingredient..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {formData.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="flex-1">{ing}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Preparation Steps</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
                placeholder="Add step..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={addStep}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
            </div>
            <ol className="space-y-2">
              {formData.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-semibold text-gray-600 mt-0.5">{idx + 1}.</span>
                  <span className="flex-1">{step}</span>
                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              {recipe ? 'Update Recipe' : 'Add Recipe'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Meal Planner Component
function MealPlanner({ recipes, currentUser, mealPlans, onUpdateMealPlan }) {
  const getWeekId = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek.toISOString().split('T')[0];
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay());
    return today;
  });

  const weekId = getWeekId(currentWeekStart);
  const userPlan = mealPlans.find(p => p.userId === currentUser.id && p.weekId === weekId);
  const [meals, setMeals] = useState(userPlan?.meals || {});

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const getDayDate = (dayIndex) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + dayIndex);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const addMealToSlot = (day, mealType, recipe) => {
    const key = `${day}-${mealType}`;
    
    // Check if this exact slot already has a meal
    if (meals[key]) {
      alert(`${mealType} for ${day} already has a meal assigned. Remove it first.`);
      return;
    }
    
    // Check for duplicates in the same week (same recipe on same day)
    const isDuplicateInDay = Object.entries(meals).some(([k, v]) => {
      const [mealDay] = k.split('-');
      return mealDay === day && v.id === recipe.id;
    });

    if (isDuplicateInDay) {
      alert(`${recipe.name} is already scheduled for ${day}!`);
      return;
    }

    const updatedMeals = { ...meals, [key]: recipe };
    setMeals(updatedMeals);
    onUpdateMealPlan(weekId, {
      userId: currentUser.id,
      weekId,
      meals: updatedMeals
    });
  };

  const removeMealFromSlot = (day, mealType) => {
    const key = `${day}-${mealType}`;
    const updatedMeals = { ...meals };
    delete updatedMeals[key];
    setMeals(updatedMeals);
    onUpdateMealPlan(weekId, {
      userId: currentUser.id,
      weekId,
      meals: updatedMeals
    });
  };

  const changeWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
    
    const newWeekId = getWeekId(newDate);
    const newPlan = mealPlans.find(p => p.userId === currentUser.id && p.weekId === newWeekId);
    setMeals(newPlan?.meals || {});
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Meal Planner</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeWeek(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Previous Week
          </button>
          <span className="font-semibold text-gray-700">
            {currentWeekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <button
            onClick={() => changeWeek(1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Next Week →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-4">
        {/* Header Column */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="font-bold text-gray-700 mb-4">Meal Type</div>
          {mealTypes.map(type => (
            <div key={type} className="h-32 flex items-center justify-center border-b last:border-b-0 font-semibold text-gray-600">
              {type}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {days.map((day, dayIdx) => (
          <div key={day} className="bg-white rounded-lg shadow-md p-4">
            <div className="font-bold text-gray-700 mb-2">{day}</div>
            <div className="text-sm text-gray-500 mb-4">{getDayDate(dayIdx)}</div>
            {mealTypes.map(type => {
              const key = `${day}-${type}`;
              const meal = meals[key];
              
              return (
                <MealSlot
                  key={key}
                  meal={meal}
                  recipes={recipes}
                  onAdd={(recipe) => addMealToSlot(day, type, recipe)}
                  onRemove={() => removeMealFromSlot(day, type)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Meal Slot Component
function MealSlot({ meal, recipes, onAdd, onRemove }) {
  const [showRecipeList, setShowRecipeList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (meal) {
    return (
      <div className="h-32 border-b last:border-b-0 p-2 relative group">
        <div className="bg-orange-50 border border-orange-200 rounded p-2 h-full flex flex-col justify-between">
          <div>
            <div className="font-semibold text-sm text-gray-800 line-clamp-2">{meal.name}</div>
            <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {meal.prepTime}m
            </div>
          </div>
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded p-1 transition"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-32 border-b last:border-b-0 p-2 relative">
      {!showRecipeList ? (
        <button
          onClick={() => setShowRecipeList(true)}
          className="w-full h-full border-2 border-dashed border-gray-300 rounded hover:border-orange-400 hover:bg-orange-50 transition flex items-center justify-center"
        >
          <Plus className="w-6 h-6 text-gray-400" />
        </button>
      ) : (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64 max-h-80 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              autoFocus
            />
            <button
              onClick={() => setShowRecipeList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {filteredRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => {
                  onAdd(recipe);
                  setShowRecipeList(false);
                  setSearchTerm('');
                }}
                className="w-full text-left p-2 hover:bg-orange-50 rounded text-sm"
              >
                <div className="font-semibold text-gray-800">{recipe.name}</div>
                <div className="text-xs text-gray-600">{recipe.prepTime}m • ${recipe.cost}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}