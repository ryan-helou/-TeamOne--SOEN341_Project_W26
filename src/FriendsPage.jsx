import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Friends.css'

function FriendsPage() {
    const navigate = useNavigate()
    const storedUser = localStorage.getItem('user')
    const currentUser = storedUser ? JSON.parse(storedUser).username : null

    const [tab, setTab] = useState('find') // 'find' | 'requests' | 'friends'
    const [allUsers, setAllUsers] = useState([])
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    /* ── Data fetching ──────────────────────────── */

    const fetchAll = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const [usersRes, friendsRes, requestsRes] = await Promise.all([
                fetch('/users/all'),
                fetch('/friends/'),
                fetch('/friends/requests')
            ])
            const usersData = await usersRes.json()
            const friendsData = await friendsRes.json()
            const requestsData = await requestsRes.json()

            if (usersData.success) setAllUsers(usersData.usernames || [])
            if (friendsData.success) setFriends(friendsData.friends || [])
            if (requestsData.success) setRequests(requestsData.requests || [])
        } catch {
            setError('Could not connect to server')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => setSuccess(''), 3000)
            return () => clearTimeout(t)
        }
    }, [success])

    /* ── Actions ────────────────────────────────── */

    const handleSendRequest = async (recipient) => {
        setError('')
        try {
            const res = await fetch('/send-friend-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipient })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess(`Friend request sent to "${recipient}"`)
                fetchAll()
            } else {
                setError(data.message || 'Failed to send friend request')
            }
        } catch {
            setError('Could not connect to server')
        }
    }

    const handleAccept = async (from) => {
        setError('')
        try {
            const res = await fetch('/accept-pending-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess(`You are now friends with "${from}"`)
                fetchAll()
            } else {
                setError(data.message || 'Failed to accept request')
            }
        } catch {
            setError('Could not connect to server')
        }
    }

    const handleDecline = async (from) => {
        setError('')
        try {
            const res = await fetch('/decline-pending-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess(`Declined request from "${from}"`)
                fetchAll()
            } else {
                setError(data.message || 'Failed to decline request')
            }
        } catch {
            setError('Could not connect to server')
        }
    }

    const handleLogout = async () => {
        try { await fetch('/logout') } catch { /* noop */ }
        localStorage.removeItem('user')
        navigate('/login')
    }

    /* ── Filtered users for Find tab ────────────── */

    const filteredUsers = allUsers.filter(u =>
        u !== currentUser &&
        u.toLowerCase().includes(searchTerm.toLowerCase())
    )

    /* ── Render ──────────────────────────────────── */

    return (
        <div className="friends-page">
            {/* Top Bar */}
            <div className="friends-topbar">
                <h1>👥 Friends</h1>
                <div className="friends-topbar-actions">
                    <Link to="/recipes" className="btn-back">🍳 Recipes</Link>
                    <Link to="/meal-plan" className="btn-back">📅 Meal Plan</Link>
                    <Link to="/profile" className="btn-back">👤 Profile</Link>
                    <button className="btn-back" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </div>

            {/* Messages */}
            {error && <div className="friends-error">{error}</div>}
            {success && <div className="friends-success">{success}</div>}

            {/* Tabs */}
            <div className="friends-tabs">
                <button
                    className={`tab-btn ${tab === 'find' ? 'active' : ''}`}
                    onClick={() => setTab('find')}
                >
                    🔍 Find Friends
                </button>
                <button
                    className={`tab-btn ${tab === 'requests' ? 'active' : ''}`}
                    onClick={() => setTab('requests')}
                >
                    📩 Requests
                    {requests.length > 0 && <span className="tab-badge">{requests.length}</span>}
                </button>
                <button
                    className={`tab-btn ${tab === 'friends' ? 'active' : ''}`}
                    onClick={() => setTab('friends')}
                >
                    ❤️ My Friends
                    {friends.length > 0 && <span className="tab-badge">{friends.length}</span>}
                </button>
            </div>

            {loading ? (
                <div className="friends-loading">
                    <div className="spinner"></div>
                    <span>Loading…</span>
                </div>
            ) : (
                <div className="friends-content">
                    {/* ── Find Friends Tab ──────────── */}
                    {tab === 'find' && (
                        <>
                            <div className="friends-search-wrapper">
                                <span className="search-icon">🔍</span>
                                <input
                                    className="friends-search"
                                    type="text"
                                    placeholder="Search users by name…"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="user-list">
                                {filteredUsers.length === 0 ? (
                                    <div className="friends-empty">
                                        {searchTerm ? 'No users match your search.' : 'No other users found.'}
                                    </div>
                                ) : (
                                    filteredUsers.map(username => {
                                        const isFriend = friends.includes(username)
                                        return (
                                            <div key={username} className="user-card">
                                                <div className="user-info">
                                                    <span className="user-avatar">👤</span>
                                                    <span className="user-name">{username}</span>
                                                </div>
                                                {isFriend ? (
                                                    <span className="friend-badge">✓ Friends</span>
                                                ) : (
                                                    <button
                                                        className="btn-add-friend"
                                                        onClick={() => handleSendRequest(username)}
                                                    >
                                                        + Add Friend
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </>
                    )}

                    {/* ── Requests Tab ──────────────── */}
                    {tab === 'requests' && (
                        <div className="user-list">
                            {requests.length === 0 ? (
                                <div className="friends-empty">
                                    No pending friend requests.
                                </div>
                            ) : (
                                requests.map(from => (
                                    <div key={from} className="user-card request-card">
                                        <div className="user-info">
                                            <span className="user-avatar">👤</span>
                                            <div>
                                                <span className="user-name">{from}</span>
                                                <span className="request-label">wants to be your friend</span>
                                            </div>
                                        </div>
                                        <div className="request-actions">
                                            <button
                                                className="btn-accept"
                                                onClick={() => handleAccept(from)}
                                            >
                                                ✓ Accept
                                            </button>
                                            <button
                                                className="btn-decline"
                                                onClick={() => handleDecline(from)}
                                            >
                                                ✕ Decline
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ── My Friends Tab ────────────── */}
                    {tab === 'friends' && (
                        <div className="user-list">
                            {friends.length === 0 ? (
                                <div className="friends-empty">
                                    You haven't added any friends yet. Use "Find Friends" to get started!
                                </div>
                            ) : (
                                friends.map(username => (
                                    <div key={username} className="user-card">
                                        <div className="user-info">
                                            <span className="user-avatar">👤</span>
                                            <span className="user-name">{username}</span>
                                        </div>
                                        <span className="friend-badge">✓ Friends</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default FriendsPage
