import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { useBreadcrumb } from '../contexts/BreadcrumbContext'
import { LoadingSpinner } from './ui/Loading'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  PersonIcon,
  HeartIcon,
  PlusIcon
} from '@radix-ui/react-icons'
import { vaccinationAPI } from '../lib/api'

const VaccinationScheduleForm = ({ pet, client, onBack }) => {
  const [formData, setFormData] = useState({
    date: '',
    weight_killogram: '',
    temperature: '',
    complain_diagnosis: '',
    treatment: '',
    pet_ids: [pet.id] // Include the current pet by default
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [pendingSchedules, setPendingSchedules] = useState([])
  const [loadingSchedules, setLoadingSchedules] = useState(true)
  const { updateBreadcrumbs } = useBreadcrumb()

  // Memoize the breadcrumb handlers to prevent infinite re-renders
  const handleBackToClients = useCallback(() => {
    onBack('clients')
  }, [onBack])

  const handleBackToPets = useCallback(() => {
    onBack('pets')
  }, [onBack])

  // Update breadcrumbs on component mount
  React.useEffect(() => {
    updateBreadcrumbs([
      { label: 'Client Management', onClick: handleBackToClients },
      { label: `${client.fullname}'s Pets`, onClick: handleBackToPets },
      { label: `${pet.name} - Medical Schedule`, href: null }
    ])
    
    // Fetch pending schedules for this pet
    fetchPendingSchedules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet.name, client.fullname, pet.id]) // Add pet.id to dependencies

  const fetchPendingSchedules = useCallback(async () => {
    try {
      setLoadingSchedules(true)
      const response = await vaccinationAPI.getByPet(pet.id)
      console.log('Fetched schedules response:', response)
      
      // The API returns the array directly, not wrapped in a data property
      const schedules = Array.isArray(response) ? response : (response.data || [])
      console.log('Processed schedules:', schedules)
      setPendingSchedules(schedules)
    } catch (error) {
      console.error('Error fetching pending schedules:', error)
      setPendingSchedules([])
    } finally {
      setLoadingSchedules(false)
    }
  }, [pet.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Add validation before sending
    if (!formData.date || !formData.weight_killogram || !formData.temperature || 
        !formData.complain_diagnosis || !formData.treatment) {
      setError('Please fill in all required fields.')
      setLoading(false)
      return
    }
    
    try {
      console.log('Submitting vaccination data:', formData)
      
      // Use the vaccinationAPI instead of direct fetch
      const result = await vaccinationAPI.create(formData)
      
      console.log('Vaccination schedule created:', result)
      
      setSuccess(true)
      setFormData({
        date: '',
        weight_killogram: '',
        temperature: '',
        complain_diagnosis: '',
        treatment: '',
        pet_ids: [pet.id]
      })

      // Refresh pending schedules list
      fetchPendingSchedules()

      // Show success message for 2 seconds then go back
      setTimeout(() => {
        onBack('pets')
      }, 2000)

    } catch (error) {
      console.error('Full error object:', error)
      console.error('Error response:', error.response)
      console.error('Error request:', error.request)
      console.error('Error message:', error.message)
      
      // Handle different types of errors
      let errorMessage = 'Failed to create vaccination schedule. Please try again.'
      
      if (error.response) {
        // Server responded with error status
        console.log('Response status:', error.response.status)
        console.log('Response data:', error.response.data)
        
        if (error.response.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data?.errors) {
          // Handle validation errors
          const validationErrors = Object.values(error.response.data.errors).flat()
          errorMessage = validationErrors.join(', ')
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Vaccination Schedule Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              The vaccination schedule for {pet.name} has been saved.
            </p>
            <LoadingSpinner size="sm" />
            <p className="text-sm text-gray-500 mt-2">Returning to pets list...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Medical Schedule
              </CardTitle>
              <CardDescription>
                Create a medical schedule for {pet.name}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <PersonIcon className="h-3 w-3" />
                {client.fullname}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <HeartIcon className="h-3 w-3" />
                {pet.name}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="weight_killogram" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="weight_killogram"
                  name="weight_killogram"
                  value={formData.weight_killogram}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., 5.2"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., 38.5"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="complain_diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint/Diagnosis *
                </label>
                <input
                  type="text"
                  id="complain_diagnosis"
                  name="complain_diagnosis"
                  value={formData.complain_diagnosis}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., Routine vaccination, Fever, Injury"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment *
                </label>
                <textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., Administered rabies vaccine, Prescribed antibiotics"
                  disabled={loading}
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating Schedule...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Create Medical Schedule
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onBack('pets')}
                disabled={loading}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pending Schedules Section */}
      <Card className="mt-6 max-w-4xl mx-auto">
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Medical History for {pet.name}
          </h3>
        </CardHeader>
        <CardContent>
          {loadingSchedules ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="md" />
              <span className="ml-2 text-gray-600">Loading medical history...</span>
            </div>
          ) : pendingSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No medical schedules found for {pet.name}</p>
              <p className="text-sm mt-2">Create the first medical schedule above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSchedules.map((schedule, index) => (
                <div key={schedule.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date & Time</label>
                      <p className="text-gray-900">{new Date(schedule.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                      <p className="text-gray-900">{schedule.weight_killogram}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Temperature (°C)</label>
                      <p className="text-gray-900">{schedule.temperature}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Complaint/Diagnosis</label>
                      <p className="text-gray-900">{schedule.complain_diagnosis}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Treatment</label>
                      <p className="text-gray-900">{schedule.treatment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default VaccinationScheduleForm
