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
  PlusIcon,
  MixerHorizontalIcon,
  ScissorsIcon,
  ActivityLogIcon,
  ArchiveIcon,
  FileTextIcon,
  Cross2Icon,
  Pencil1Icon,
  CheckIcon,
  TrashIcon,
  DotsHorizontalIcon,
  ChevronDownIcon
} from '@radix-ui/react-icons'
import { vaccinationAPI } from '../lib/api'

const VaccinationScheduleForm = ({ pet, client, onBack }) => {
  // Medical service types configuration
  const medicalServices = [
    {
      id: 'cbc_test',
      name: 'CBC Test',
      icon: ActivityLogIcon,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      description: 'Complete Blood Count analysis'
    },
    {
      id: 'groom',
      name: 'Grooming',
      icon: ScissorsIcon,
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      description: 'Professional pet grooming service'
    },
    {
      id: 'parasite_treatment',
      name: 'Parasite Treatment',
      icon: Cross2Icon,
      color: 'bg-red-100 text-red-700 border-red-200',
      description: 'Treatment for parasites and infestations'
    },
    {
      id: 'vaccination',
      name: 'Vaccination',
      icon: ArchiveIcon,
      color: 'bg-green-100 text-green-700 border-green-200',
      description: 'Immunization and vaccine administration'
    },
    {
      id: 'surgery',
      name: 'Surgery',
      icon: MixerHorizontalIcon,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      description: 'Surgical procedures and operations'
    },
    {
      id: 'prescription',
      name: 'Prescription',
      icon: FileTextIcon,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      description: 'Medication prescription and management'
    }
  ]

  const [formData, setFormData] = useState({
    date: '',
    weight_killogram: '',
    temperature: '',
    complain_diagnosis: '',
    treatment: '',
    medical_service_type: 'vaccination', // Default to vaccination
    follow_up: '', // Add follow-up field
    pet_ids: [pet.id] // Include the current pet by default
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [pendingSchedules, setPendingSchedules] = useState([])
  const [loadingSchedules, setLoadingSchedules] = useState(true)
  const [selectedHistoryService, setSelectedHistoryService] = useState(null) // For medical history filtering
  const [editingSchedule, setEditingSchedule] = useState(null) // For editing mode
  const [actionLoading, setActionLoading] = useState({}) // Track loading state for individual actions
  const [openDropdown, setOpenDropdown] = useState(null) // Track which dropdown is open
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
      { label: `${pet.name} - Medical Record`, href: null }
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
      
      // Transform the data to match backend expectations
      const backendData = {
        ...formData,
        service: formData.medical_service_type, // Map frontend field to backend field
      }
      delete backendData.medical_service_type // Remove the frontend-only field
      
      console.log('Backend data:', backendData)
      
      let result
      if (editingSchedule) {
        // Update existing schedule
        result = await vaccinationAPI.update(editingSchedule.id, backendData)
        console.log('Vaccination schedule updated:', result)
      } else {
        // Create new schedule
        result = await vaccinationAPI.create(backendData)
        console.log('Vaccination schedule created:', result)
      }
      
      setSuccess(true)
      setFormData({
        date: '',
        weight_killogram: '',
        temperature: '',
        complain_diagnosis: '',
        treatment: '',
        medical_service_type: 'vaccination',
        follow_up: '',
        pet_ids: [pet.id]
      })
      setEditingSchedule(null)

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
      let errorMessage = 'Failed to create medical record. Please try again.'
      
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

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      medical_service_type: serviceId
    }))
  }

  const getSelectedService = () => {
    return medicalServices.find(service => service.id === formData.medical_service_type)
  }

  // Handle dropdown toggle
  const toggleDropdown = (scheduleId) => {
    setOpenDropdown(openDropdown === scheduleId ? null : scheduleId)
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Helper function to group schedules by service type
  const getSchedulesByService = () => {
    const grouped = {}
    pendingSchedules.forEach(schedule => {
      const serviceType = schedule.service || 'vaccination'
      if (!grouped[serviceType]) {
        grouped[serviceType] = []
      }
      grouped[serviceType].push(schedule)
    })
    return grouped
  }

  // Get available services that have history records
  const getAvailableHistoryServices = () => {
    const schedulesByService = getSchedulesByService()
    return medicalServices.filter(service => 
      schedulesByService[service.id] && schedulesByService[service.id].length > 0
    )
  }

  // Get filtered schedules based on selected service
  const getFilteredSchedules = () => {
    if (!selectedHistoryService) {
      return pendingSchedules
    }
    return pendingSchedules.filter(schedule => 
      (schedule.service || 'vaccination') === selectedHistoryService
    )
  }

  // Handle schedule actions
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    // Pre-fill form with existing data
    setFormData({
      date: schedule.date ? new Date(schedule.date).toISOString().slice(0, 16) : '',
      weight_killogram: schedule.weight_killogram || '',
      temperature: schedule.temperature || '',
      complain_diagnosis: schedule.complain_diagnosis || '',
      treatment: schedule.treatment || '',
      medical_service_type: schedule.service || 'vaccination',
      follow_up: schedule.follow_up ? new Date(schedule.follow_up).toISOString().slice(0, 16) : '',
      pet_ids: [pet.id]
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingSchedule(null)
    // Reset form
    setFormData({
      date: '',
      weight_killogram: '',
      temperature: '',
      complain_diagnosis: '',
      treatment: '',
      medical_service_type: 'vaccination',
      follow_up: '',
      pet_ids: [pet.id]
    })
  }

  const handleCancelSchedule = async (scheduleId) => {
    setActionLoading(prev => ({ ...prev, [scheduleId]: 'cancelling' }))
    
    try {
      await vaccinationAPI.markCancelled(scheduleId)
      
      // Refresh the schedules list
      await fetchPendingSchedules()
      
      setError(null)
    } catch (error) {
      console.error('Error cancelling schedule:', error)
      setError('Failed to cancel the schedule. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [scheduleId]: null }))
    }
  }

  const handleCompleteSchedule = async (scheduleId) => {
    setActionLoading(prev => ({ ...prev, [scheduleId]: 'completing' }))
    
    try {
      await vaccinationAPI.markCompleted(scheduleId)
      
      // Refresh the schedules list
      await fetchPendingSchedules()
      
      setError(null)
    } catch (error) {
      console.error('Error completing schedule:', error)
      setError('Failed to complete the schedule. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [scheduleId]: null }))
    }
  }

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to permanently delete this record? This action cannot be undone.')) {
      return
    }

    setActionLoading(prev => ({ ...prev, [scheduleId]: 'deleting' }))
    
    try {
      await vaccinationAPI.delete(scheduleId)
      
      // Refresh the schedules list
      await fetchPendingSchedules()
      
      setError(null)
    } catch (error) {
      console.error('Error deleting schedule:', error)
      setError('Failed to delete the schedule. Please try again.')
    } finally {
      setActionLoading(prev => ({ ...prev, [scheduleId]: null }))
    }
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
              Medical Record Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              The medical record for {pet.name} has been saved.
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Medical Record Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      {editingSchedule ? 'Edit Medical Record' : 'Medical Record'}
                    </CardTitle>
                    <CardDescription className="mt-1 text-gray-600">
                      {editingSchedule ? `Update medical record for ${pet.name}` : `Create a medical record for ${pet.name}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="flex items-center gap-1 text-blue-700 border-blue-200">
                      <PersonIcon className="h-3 w-3" />
                      {client.fullname}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1 text-green-700 bg-green-100 border-green-200">
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

          {/* Medical Service Selection */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Select Medical Service Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalServices.map((service) => {
                const IconComponent = service.icon
                const isSelected = formData.medical_service_type === service.id
                
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceSelect(service.id)}
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                      isSelected 
                        ? `${service.color} ring-2 ring-offset-2 ring-blue-500 shadow-md` 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className={`h-6 w-6 ${isSelected ? '' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isSelected ? '' : 'text-gray-900'}`}>
                        {service.name}
                      </span>
                    </div>
                    <p className={`text-sm ${isSelected ? 'opacity-90' : 'text-gray-600'}`}>
                      {service.description}
                    </p>
                  </button>
                )
              })}
            </div>
            
            {/* Selected Service Display */}
            {formData.medical_service_type && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-900">Selected Service:</span>
                  <Badge variant="secondary" className="flex items-center gap-1 text-blue-700 bg-blue-100 border-blue-200">
                    {React.createElement(getSelectedService()?.icon, { className: "h-3 w-3" })}
                    {getSelectedService()?.name}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="weight_killogram" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="weight_killogram"
                  name="weight_killogram"
                  value={formData.weight_killogram}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., 5.2"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., 38.5"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label htmlFor="complain_diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint/Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="complain_diagnosis"
                  name="complain_diagnosis"
                  value={formData.complain_diagnosis}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Routine vaccination, Fever, Injury"
                  disabled={loading}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Administered rabies vaccine, Prescribed antibiotics"
                  disabled={loading}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="follow_up" className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="datetime-local"
                  id="follow_up"
                  name="follow_up"
                  value={formData.follow_up || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  disabled={loading}
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
                    <span className="text-white">
                      {editingSchedule ? 'Updating Record...' : 'Creating Record...'}
                    </span>
                  </>
                ) : (
                  <>
                    {editingSchedule ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        <span className="text-white">Update Medical Record</span>
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4" />
                        <span className="text-white">Create Medical Record</span>
                      </>
                    )}
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={editingSchedule ? handleCancelEdit : () => onBack('pets')}
                disabled={loading}
                className="flex items-center justify-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>{editingSchedule ? 'Cancel Edit' : 'Cancel'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    
    {/* Right Column - Medical History */}
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Medical History for <span className="text-green-700">{pet.name}</span>
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
              <p className="text-gray-600">No medical records found for <span className="font-medium text-gray-900">{pet.name}</span></p>
              <p className="text-sm mt-2 text-gray-500">Create the first medical record above.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Service Filter Cards */}
              <div>
                <h4 className="text-base font-medium text-gray-700 mb-4">Filter by Service Type</h4>
                <div className="flex flex-wrap gap-3 mb-4">
                  {/* All Services Button */}
                  <button
                    onClick={() => setSelectedHistoryService(null)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 text-sm ${
                      selectedHistoryService === null
                        ? 'bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-500 ring-offset-1'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">All Records ({pendingSchedules.length})</span>
                  </button>

                  {/* Individual Service Cards */}
                  {getAvailableHistoryServices().map((service) => {
                    const schedulesByService = getSchedulesByService()
                    const count = schedulesByService[service.id]?.length || 0
                    const IconComponent = service.icon
                    const isSelected = selectedHistoryService === service.id

                    return (
                      <button
                        key={service.id}
                        onClick={() => setSelectedHistoryService(service.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 text-sm ${
                          isSelected
                            ? `${service.color} ring-2 ring-blue-500 ring-offset-1 font-medium`
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{service.name} ({count})</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Filtered Schedule Display */}
              <div>
                {selectedHistoryService && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-blue-900">
                        Showing {selectedHistoryService.replace('_', ' ')} history:
                      </span>
                      <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-blue-700 bg-blue-100 border-blue-200">
                        {React.createElement(
                          medicalServices.find(s => s.id === selectedHistoryService)?.icon, 
                          { className: "h-4 w-4" }
                        )}
                        <span className="font-medium">{getFilteredSchedules().length} record(s)</span>
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {getFilteredSchedules().map((schedule, index) => {
                    const serviceType = schedule.service || 'vaccination'
                    const service = medicalServices.find(s => s.id === serviceType) || medicalServices[3]
                    const ServiceIcon = service.icon
                    const currentActionLoading = actionLoading[schedule.id]
                    const isEditing = editingSchedule?.id === schedule.id
                    
                    return (
                      <div key={schedule.id || index} className={`border-2 rounded-lg p-4 transition-colors ${
                        isEditing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={`flex items-center gap-1 ${service.color} border px-2 py-1 font-medium`}>
                              <ServiceIcon className="h-4 w-4" />
                              {service.name}
                            </Badge>
                            {schedule.status && (
                              <Badge variant={
                                schedule.status === 'pending' ? 'secondary' : 
                                schedule.status === 'completed' ? 'default' : 
                                schedule.status === 'cancelled' ? 'destructive' :
                                'secondary'
                              } className={`px-2 py-1 font-medium ${
                                schedule.status === 'pending' ? 'text-yellow-700 bg-yellow-100 border-yellow-200' :
                                schedule.status === 'completed' ? 'text-green-700 bg-green-100 border-green-200' :
                                schedule.status === 'cancelled' ? 'text-red-700 bg-red-100 border-red-200' :
                                'text-gray-700 bg-gray-100 border-gray-200'
                              }`}>
                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                              </Badge>
                            )}
                            <span className="text-sm text-gray-600 font-medium">
                              {new Date(schedule.date).toLocaleDateString()}
                            </span>
                            {isEditing && (
                              <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 font-medium">
                                Currently Editing
                              </Badge>
                            )}
                          </div>
                          
                          {/* Action Dropdown */}
                          <div className="relative">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleDropdown(schedule.id)
                              }}
                              disabled={!!currentActionLoading}
                              className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                            >
                              <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                            
                            {/* Dropdown Menu */}
                            {openDropdown === schedule.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                  {schedule.status !== 'cancelled' && schedule.status !== 'completed' && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditSchedule(schedule)
                                          setOpenDropdown(null)
                                        }}
                                        disabled={!!currentActionLoading || isEditing}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <Pencil1Icon className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">Edit Record</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleCompleteSchedule(schedule.id)
                                          setOpenDropdown(null)
                                        }}
                                        disabled={!!currentActionLoading}
                                        className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50 hover:text-green-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {currentActionLoading === 'completing' ? (
                                          <LoadingSpinner size="xs" />
                                        ) : (
                                          <CheckIcon className="h-4 w-4" />
                                        )}
                                        <span className="font-medium">Mark Complete</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleCancelSchedule(schedule.id)
                                          setOpenDropdown(null)
                                        }}
                                        disabled={!!currentActionLoading}
                                        className="w-full text-left px-3 py-2 text-sm text-orange-700 hover:bg-orange-50 hover:text-orange-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        {currentActionLoading === 'cancelling' ? (
                                          <LoadingSpinner size="xs" />
                                        ) : (
                                          <Cross2Icon className="h-4 w-4" />
                                        )}
                                        <span className="font-medium">Cancel Record</span>
                                      </button>
                                      
                                      <hr className="my-1" />
                                    </>
                                  )}
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteSchedule(schedule.id)
                                      setOpenDropdown(null)
                                    }}
                                    disabled={!!currentActionLoading}
                                    className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {currentActionLoading === 'deleting' ? (
                                      <LoadingSpinner size="xs" />
                                    ) : (
                                      <TrashIcon className="h-4 w-4" />
                                    )}
                                    <span className="font-medium">Delete Record</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Date & Time</label>
                            <p className="text-gray-900 mt-1 font-medium">{new Date(schedule.date).toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                            <p className="text-gray-900 mt-1 font-medium">{schedule.weight_killogram}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Temperature (°C)</label>
                            <p className="text-gray-900 mt-1 font-medium">{schedule.temperature}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Complaint/Diagnosis</label>
                            <p className="text-gray-900 mt-1">{schedule.complain_diagnosis}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Treatment</label>
                            <p className="text-gray-900 mt-1">{schedule.treatment}</p>
                          </div>
                          {schedule.follow_up && (
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-gray-700">Follow-up Scheduled</label>
                              <p className="text-blue-700 mt-1 font-medium">{new Date(schedule.follow_up).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {getFilteredSchedules().length === 0 && selectedHistoryService && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {React.createElement(
                        medicalServices.find(s => s.id === selectedHistoryService)?.icon, 
                        { className: "h-8 w-8 text-gray-400" }
                      )}
                    </div>
                    <p className="text-gray-600">No {selectedHistoryService.replace('_', ' ')} records found for <span className="font-medium text-gray-900">{pet.name}</span></p>
                    <p className="text-sm mt-2 text-gray-500">Records will appear here when you create them above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    
      </div>
    </div>
  </div>
  )
}

export default VaccinationScheduleForm
