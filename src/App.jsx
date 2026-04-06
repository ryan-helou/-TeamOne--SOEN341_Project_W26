import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProfileView from './components/auth/ProfileView'
import ProfileEdit from './components/auth/ProfileEdit'
import ChangePassword from './components/auth/ChangePassword'
import RecipePage from './components/recipes/RecipePage'
import MealPlanPage from './components/mealplan/MealPlanPage'
import FriendsPage from './components/friends/FriendsPage'

function ProfilePage() {
  const [view, setView] = useState('view')
  const storedUser = localStorage.getItem('user')
  const username = storedUser ? JSON.parse(storedUser).username : 'Guest'

  if (view === 'edit') {
    return (
      <ProfileEdit
        username={username}
        onCancel={() => setView('view')}
        onSaveSuccess={() => setView('view')}
      />
    )
  }

  if (view === 'password') {
    return (
      <ChangePassword
        onCancel={() => setView('view')}
        onChangeSuccess={() => setView('view')}
      />
    )
  }

  return (
    <ProfileView
      username={username}
      onEdit={() => setView('edit')}
      onChangePassword={() => setView('password')}
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
