// utils/jwt.ts
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  email: string
  roles: string[]
  permissions: string[]
  exp: number
}

export function decodeToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token)
}

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeToken(token)
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}