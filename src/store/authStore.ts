// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decodeToken } from '../utils/jwt'
import type {  TokenData, User } from '#/types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  roles: string[]
  permissions: string[]
  setAuth: (data: TokenData) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      roles: [],
      permissions: [],

     setAuth: (data) => {
  const decoded = decodeToken(data.accessToken)
  set({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
    roles: decoded.roles ?? [],
    permissions: decoded.permissions ?? [],
  })
},

      clearAuth: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
        roles: [],
        permissions: [],
      }),
    }),
    { name: 'auth' } // persists to localStorage
  )
)