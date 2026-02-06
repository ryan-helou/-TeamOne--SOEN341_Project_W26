import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ProfileView from './ProfileView'
import ProfileEdit from './ProfileEdit'
import ChangePassword from './ChangePassword'

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
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
