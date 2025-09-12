import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Separator } from './ui/Separator'
import { Badge } from './ui/Badge'
import { Avatar, AvatarFallback } from './ui/Avatar'
import SettingsModal from './SettingsModal'
import Logo2 from '../assets/logos/Logo2'
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      icon: DashboardIcon,
      href: '#',
      current: currentPage === 'Dashboard',
      breadcrumb: [{ label: 'Dashboard', href: null }]
    },
    // {
    //   name: 'Patients',
    //   icon: HeartIcon,
    //   href: '#',
    //   current: currentPage === 'Patients',
    //   count: '1,234',
    //   breadcrumb: [{ label: 'Patients', href: null }]
    // },
    // {
    //   name: 'Appointments',
    //   icon: CalendarIcon,
    //   href: '#',
    //   current: currentPage === 'Appointments',
    //   count: '23',
    //   breadcrumb: [{ label: 'Appointments', href: null }]
    // },
    // {
    //   name: 'Medical Records',
    //   icon: FileTextIcon,
    //   href: '#',
    //   current: currentPage === 'Medical Records',
    //   breadcrumb: [{ label: 'Medical Records', href: null }]
    // },
    // {
    //   name: 'Staff',
    //   icon: PersonIcon,
    //   href: '#',
    //   current: currentPage === 'Staff',
    //   count: '12',
    //   breadcrumb: [{ label: 'Staff', href: null }]
    // },
    {
      name: 'Clients',
      icon: PersonIcon,
      href: '#',
      current: currentPage === 'Clients',
      breadcrumb: [{ label: 'Clients', href: null }]
    },
    // {
    //   name: 'Reports',
    //   icon: BarChartIcon,
    //   href: '#',
    //   current: currentPage === 'Reports',
    //   breadcrumb: [{ label: 'Reports', href: null }]
    // },
    // {
    //   name: 'Activity Log',
    //   icon: ActivityLogIcon,
    //   href: '#',
    //   current: currentPage === 'Activity Log',
    //   breadcrumb: [{ label: 'Activity Log', href: null }]
    // }
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
        fixed inset-y-0 left-0 z-50 w-64 bg-card dark:bg-card border-r dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Logo2 variant="text" className="h-8 w-auto" />
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
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
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
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
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
          <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsSettingsOpen(true)}
            >
              <GearIcon className="mr-3 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={logout}
            >
              <ExitIcon className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </>
  )
}

export default Sidebar
