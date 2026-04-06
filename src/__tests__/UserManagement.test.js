import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(() => false),
        readFileSync: vi.fn(() => '[]'),
        writeFileSync: vi.fn(),
    },
}))

import fs from 'fs'
import {
    loadUsers, registerUser, loginUser, authenticateUser,
    changePassword, updateUser, isPasswordStrong, getUser,
    userAlreadyExists, getFriends, getFriendRequests,
    sendFriendRequest, acceptFriendRequest, declineFriendRequest,
} from '../server/UserManagement.js'

beforeEach(() => {
    vi.clearAllMocks()
    fs.existsSync.mockReturnValue(false)
    fs.readFileSync.mockReturnValue('[]')
    fs.writeFileSync.mockImplementation(() => {})
    loadUsers()
})

describe('isPasswordStrong', () => {
    it('validates password strength correctly', () => {
        expect(isPasswordStrong('Ab1')).toBe(false)
        expect(isPasswordStrong('abcdefg1')).toBe(false)
        expect(isPasswordStrong('Abcdefgh')).toBe(false)
        expect(isPasswordStrong('Abcdefg1')).toBe(true)
    })
})

describe('registerUser', () => {
    it('registers a new user and rejects duplicates', () => {
        const result = registerUser('alice', 'StrongPass1')
        expect(result).toEqual({ success: true, message: 'User registered successfully' })
        const dup = registerUser('alice', 'StrongPass2')
        expect(dup.success).toBe(false)
    })
})

describe('loginUser', () => {
    it('succeeds with correct credentials and fails otherwise', () => {
        registerUser('alice', 'StrongPass1')
        expect(loginUser('alice', 'StrongPass1').success).toBe(true)
        expect(loginUser('alice', 'WrongPass1').success).toBe(false)
        expect(loginUser('ghost', 'StrongPass1').success).toBe(false)
    })
})

describe('authenticateUser', () => {
    it('returns true for valid credentials', () => {
        registerUser('alice', 'StrongPass1')
        expect(authenticateUser('alice', 'StrongPass1')).toBe(true)
        expect(authenticateUser('alice', 'WrongPass1')).toBe(false)
    })
})

describe('getUser', () => {
    it('returns the user object or undefined', () => {
        expect(getUser('alice')).toBeUndefined()
        registerUser('alice', 'StrongPass1')
        expect(getUser('alice').username).toBe('alice')
    })
})

describe('userAlreadyExists', () => {
    it('checks if a username is taken', () => {
        expect(userAlreadyExists('alice')).toBe(false)
        registerUser('alice', 'StrongPass1')
        expect(userAlreadyExists('alice')).toBe(true)
    })
})

describe('changePassword', () => {
    it('changes password when old password is correct', () => {
        registerUser('alice', 'StrongPass1')
        expect(changePassword('alice', 'StrongPass1', 'NewPass123').success).toBe(true)
        expect(authenticateUser('alice', 'NewPass123')).toBe(true)
        expect(authenticateUser('alice', 'StrongPass1')).toBe(false)
    })
})

describe('updateUser', () => {
    it('updates profile fields for existing user', () => {
        registerUser('alice', 'StrongPass1')
        expect(updateUser('alice', { diet: 'vegan' }).success).toBe(true)
        expect(getUser('alice').diet).toBe('vegan')
        expect(updateUser('ghost', { diet: 'vegan' }).success).toBe(false)
    })
})

describe('getFriends', () => {
    it('returns friends list or undefined', () => {
        expect(getFriends('ghost')).toBeUndefined()
        registerUser('alice', 'StrongPass1')
        expect(getFriends('alice')).toEqual([])
    })
})

describe('getFriendRequests', () => {
    it('returns pending requests or undefined', () => {
        expect(getFriendRequests('ghost')).toBeUndefined()
        registerUser('alice', 'StrongPass1')
        expect(getFriendRequests('alice')).toEqual([])
    })
})

describe('sendFriendRequest', () => {
    it('sends a friend request between two users', () => {
        registerUser('alice', 'StrongPass1')
        registerUser('bob', 'StrongPass1')
        expect(sendFriendRequest('alice', 'bob')).toBe('success')
        expect(sendFriendRequest('alice', 'bob')).toBe('already sent')
        expect(getFriendRequests('bob')).toContain('alice')
    })
})

describe('acceptFriendRequest', () => {
    it('establishes bidirectional friendship', () => {
        registerUser('alice', 'StrongPass1')
        registerUser('bob', 'StrongPass1')
        sendFriendRequest('alice', 'bob')
        acceptFriendRequest('alice', 'bob')
        expect(getFriends('alice')).toContain('bob')
        expect(getFriends('bob')).toContain('alice')
    })
})

describe('declineFriendRequest', () => {
    it('removes the pending request without adding friend', () => {
        registerUser('alice', 'StrongPass1')
        registerUser('bob', 'StrongPass1')
        sendFriendRequest('alice', 'bob')
        declineFriendRequest('alice', 'bob')
        expect(getFriendRequests('bob')).not.toContain('alice')
        expect(getFriends('bob')).not.toContain('alice')
    })
})
