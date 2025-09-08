import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useBreadcrumb } from '../contexts/BreadcrumbContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/Loading'
import { clientAPI, petAPI, vaccinationAPI } from '../lib/api'
import { 
  HeartIcon, 
  CalendarIcon, 
  FileTextIcon,
  PersonIcon,
  ActivityLogIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@radix-ui/react-icons'

const Dashboard = () => {
  const { user } = useAuth()
  const { updateBreadcrumbs } = useBreadcrumb()
  
  // State for real data
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPets: 0,
    todaysAppointments: 0,
    recentRecords: 0
  })
  const [todaysVaccinations, setTodaysVaccinations] = useState([])
  const [error, setError] = useState(null)

  // Set breadcrumbs for Dashboard
  React.useEffect(() => {
    updateBreadcrumbs([
      { label: 'Dashboard', href: null }
    ])
  }, [])

  // Fetch real data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [clientsResponse, petsResponse, vaccinationsResponse] = await Promise.all([
        clientAPI.getAll(),
        petAPI.getAll(),
        vaccinationAPI.getAll()
      ])

      // Process clients data
      const clients = Array.isArray(clientsResponse) ? clientsResponse : []
      
      // Process pets data
      const pets = Array.isArray(petsResponse) ? petsResponse : []
      
      // Process vaccinations data
      const vaccinations = Array.isArray(vaccinationsResponse) ? vaccinationsResponse : []
      
      // Filter today's vaccinations
      const today = new Date().toISOString().split('T')[0]
      const todaysVacs = vaccinations.filter(vac => {
        const vacDate = new Date(vac.date).toISOString().split('T')[0]
        return vacDate === today
      })

      // Calculate stats
      setStats({
        totalClients: clients.length,
        totalPets: pets.length,
        todaysAppointments: todaysVacs.length, // Using vaccinations as appointments for now
        recentRecords: vaccinations.length
      })

      setTodaysVaccinations(todaysVacs)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statsConfig = [
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      change: "+0%",
      description: "Registered pet owners",
      icon: PersonIcon,
      trend: "up"
    },
    {
      title: "Total Pets",
      value: stats.totalPets.toString(),
      change: "+0%",
      description: "Active pet patients",
      icon: HeartIcon,
      trend: "up"
    },
    {
      title: "Today's Vaccinations",
      value: stats.todaysAppointments.toString(),
      change: "+0",
      description: "Scheduled for today",
      icon: CalendarIcon,
      trend: "up"
    },
    {
      title: "Total Records",
      value: stats.recentRecords.toString(),
      change: "+0%",
      description: "Vaccination records",
      icon: FileTextIcon,
      trend: "up"
    }
  ]

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUpIcon className="h-3 w-3 text-green-600" />
    if (trend === 'down') return <ArrowDownIcon className="h-3 w-3 text-red-600" />
    return null
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'Urgent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPetIcon = (petType) => {
    if (petType === 'Dog' || petType === 'canine') return '🐕'
    if (petType === 'Cat' || petType === 'feline') return '🐱'
    return '🐾'
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="h-full w-full p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Loading your clinic data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <Card className="bg-white shadow">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <ActivityLogIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">{error}</p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {user?.name}! Here's what's happening at your clinic today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="bg-white shadow hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-1 mt-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm ${getTrendColor(stat.trend)}`}>
                    {stat.change}
                  </span>
                  <p className="text-sm text-gray-500 ml-1">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Today's Medical Schedules */}
        <Card className="bg-white shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl text-gray-900">
              <CalendarIcon className="h-6 w-6" />
              <span>Today's Medical Schedules</span>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Medical schedules for today ({todaysVaccinations.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysVaccinations.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No medical schedules for today</h3>
                <p className="text-gray-600">You have a clear schedule for today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysVaccinations.map((vaccination, index) => (
                  <div 
                    key={vaccination.id || index} 
                    className="group cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🏥</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {formatTime(vaccination.date)}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm font-medium text-gray-700 truncate">
                              Medical Schedule
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm text-gray-600">
                              Diagnosis: <span className="font-medium">{vaccination.complain_diagnosis}</span>
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Weight: {vaccination.weight_killogram}kg</span>
                            <span>Temp: {vaccination.temperature}°C</span>
                            <span>Treatment: {vaccination.treatment}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Scheduled
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PWA Status */}
      <Card className="bg-white shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl text-gray-900">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>Progressive Web App</span>
            <Badge variant="secondary" className="text-sm">Enabled</Badge>
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            This application supports offline functionality and can be installed on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-6 border rounded-lg bg-green-50 border-green-200">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="space-y-2 flex-1">
              <p className="text-base font-medium text-green-800">
                PWA features are active
              </p>
              <p className="text-sm text-green-700">
                Install this app on your device for the best experience. Works offline and receives automatic updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
