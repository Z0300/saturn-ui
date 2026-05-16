import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

export const authKeys = {
  me: ['me'] as const,
}

export function useMe() {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => api.get('/v1/users/me').then(r => r.data.data),
    enabled: !!accessToken,   
    staleTime: 1000 * 60 * 5, 
  })
}