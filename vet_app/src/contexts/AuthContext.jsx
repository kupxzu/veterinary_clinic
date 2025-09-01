import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const storedUser = localStorage.getItem('admin_user')

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.getProfile()
          if (response.success) {
            setUser(response.data.user)
            setIsAuthenticated(true)
          } else {
            // Token is invalid
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_user')
          }
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      
      if (response.success) {
        const { user, token } = response.data
        
        // Store in localStorage
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify(user))
        
        // Update state
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
