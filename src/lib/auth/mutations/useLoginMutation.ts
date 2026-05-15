import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth/authContext'
import { apiClient } from '@/lib/auth/authClient'
import type { LoginInput } from '@/schemas'
import type { AuthUser } from '@/types/auth'

interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export function useLoginMutation() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await apiClient.post<LoginResponse>(
        '/api/auth/login',
        credentials
      )
      return data
    },
    onSuccess: (data) => {
      // authContext.login() is now a synchronous state setter
      login(data.accessToken, data.user)
    },
  })
}