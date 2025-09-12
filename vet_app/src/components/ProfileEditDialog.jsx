import React, { useState } from 'react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from './ui/Dialog'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Badge } from './ui/Badge'
import { useAuth } from '../contexts/AuthContext'
import { 
  PersonIcon,
  EnvelopeClosedIcon,
  MobileIcon,
  LockClosedIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  CheckIcon,
  Cross1Icon
} from '@radix-ui/react-icons'

const ProfileEditDialog = ({ children }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateProfileForm = () => {
    const newErrors = {}
    
    if (activeTab === 'profile') {
      if (!profileData.email || !/\S+@\S+\.\S+/.test(profileData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      
      if (!profileData.phone || !/^\+?[\d\s-()]+$/.test(profileData.phone)) {
        newErrors.phone = 'Please enter a valid phone number'
      }
    } else if (activeTab === 'password') {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }
      
      if (!profileData.newPassword || profileData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters'
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateProfileForm()) {
      return
    }

    setLoading(true)
    setSuccessMessage('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (activeTab === 'profile') {
        setSuccessMessage('Profile updated successfully!')
      } else {
        setSuccessMessage('Password changed successfully!')
        // Clear password fields
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      }
      
      // Close dialog after success
      setTimeout(() => {
        setIsOpen(false)
        setSuccessMessage('')
      }, 2000)
      
    } catch (error) {
      setErrors({ submit: 'Failed to update. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setProfileData({
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors({})
    setSuccessMessage('')
    setActiveTab('profile')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PersonIcon className="h-5 w-5 text-blue-600" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your account information and security settings.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Cross1Icon className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">{errors.submit}</span>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Current User Info */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <PersonIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.fullname || 'Admin User'}</p>
                    <Badge variant="secondary" className="text-xs">
                      {user?.role || 'Administrator'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <EnvelopeClosedIcon className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <MobileIcon className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={profileData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password"
                    className={errors.currentPassword ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeClosedIcon className="h-4 w-4" /> : <EyeOpenIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={profileData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter your new password"
                    className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeClosedIcon className="h-4 w-4" /> : <EyeOpenIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={profileData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                    className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeClosedIcon className="h-4 w-4" /> : <EyeOpenIcon className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Password Requirements:</p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Include numbers and letters</li>
                  <li>• Different from current password</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  {activeTab === 'profile' ? 'Updating...' : 'Changing...'}
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {activeTab === 'profile' ? 'Update Profile' : 'Change Password'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileEditDialog
