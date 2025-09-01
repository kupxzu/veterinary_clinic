import React from 'react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Avatar, AvatarFallback } from './ui/Avatar'
import { useAuth } from '../contexts/AuthContext'
import { 
  HamburgerMenuIcon,
  BellIcon,
  GearIcon,
  ExitIcon
} from '@radix-ui/react-icons'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'
  }

  return (
    <header className="bg-background border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </Button>

            {/* Logo for mobile */}
            <div className="flex items-center space-x-2 lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="font-bold">VetClinic Pro</span>
            </div>

            {/* Breadcrumb for desktop */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Dashboard</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <BellIcon className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* User menu - Desktop */}
            <div className="hidden sm:flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>

            {/* Settings and Logout - Mobile */}
            <div className="flex sm:hidden items-center space-x-2">
              <Button variant="ghost" size="sm">
                <GearIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <ExitIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
