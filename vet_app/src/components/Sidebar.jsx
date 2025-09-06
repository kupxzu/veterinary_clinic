import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Separator } from './ui/Separator'
import { Badge } from './ui/Badge'
import { Avatar, AvatarFallback } from './ui/Avatar'
import { useAuth } from '../contexts/AuthContext'
import { useBreadcrumb } from '../contexts/BreadcrumbContext'
import { useNavigation } from '../contexts/NavigationContext'
import { 
  DashboardIcon,
  PersonIcon, 
  HeartIcon, 
  CalendarIcon, 
  FileTextIcon, 
  ExitIcon,
  GearIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  ActivityLogIcon,
  BarChartIcon,
  ReaderIcon
} from '@radix-ui/react-icons'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth()
  const { updateBreadcrumbs } = useBreadcrumb()
  const { currentPage, navigateTo } = useNavigation()

  const navigation = [
    {
      name: 'Dashboard',
      icon: DashboardIcon,
      href: '#',
      current: currentPage === 'Dashboard',
      breadcrumb: [{ label: 'Dashboard', href: null }]
    },
    {
      name: 'Patients',
      icon: HeartIcon,
      href: '#',
      current: currentPage === 'Patients',
      count: '1,234',
      breadcrumb: [{ label: 'Patients', href: null }]
    },
    {
      name: 'Appointments',
      icon: CalendarIcon,
      href: '#',
      current: currentPage === 'Appointments',
      count: '23',
      breadcrumb: [{ label: 'Appointments', href: null }]
    },
    {
      name: 'Medical Records',
      icon: FileTextIcon,
      href: '#',
      current: currentPage === 'Medical Records',
      breadcrumb: [{ label: 'Medical Records', href: null }]
    },
    {
      name: 'Staff',
      icon: PersonIcon,
      href: '#',
      current: currentPage === 'Staff',
      count: '12',
      breadcrumb: [{ label: 'Staff', href: null }]
    },
    {
      name: 'Clients',
      icon: PersonIcon,
      href: '#',
      current: currentPage === 'Clients',
      breadcrumb: [{ label: 'Clients', href: null }]
    },
    {
      name: 'Reports',
      icon: BarChartIcon,
      href: '#',
      current: currentPage === 'Reports',
      breadcrumb: [{ label: 'Reports', href: null }]
    },
    {
      name: 'Activity Log',
      icon: ActivityLogIcon,
      href: '#',
      current: currentPage === 'Activity Log',
      breadcrumb: [{ label: 'Activity Log', href: null }]
    }
  ]

  const handleNavigation = (item) => {
    // Update breadcrumbs and current page when navigating
    updateBreadcrumbs(item.breadcrumb)
    navigateTo(item.name)
    // Close mobile sidebar
    setIsOpen(false)
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
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
              <span className="font-bold text-lg">VetClinic Pro</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <Cross1Icon className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* User Info */}
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">Administrator</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.current 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.count && (
                    <Badge 
                      variant={item.current ? "secondary" : "outline"} 
                      className="ml-2 text-xs min-w-[2rem] justify-center"
                    >
                      {item.count}
                    </Badge>
                  )}
                </button>
              )
            })}
          </nav>

          <Separator />

          {/* Footer */}
          <div className="p-4 space-y-3 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <GearIcon className="mr-3 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={logout}
            >
              <ExitIcon className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
