import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { petAPI, clientAPI } from '../lib/api'
import { 
  ArrowLeftIcon,
  HeartIcon,
  PlusIcon
} from '@radix-ui/react-icons'

const PetForm = ({ pet = null, client = null, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'canine',
    breed: '',
    species: '',
    colormarking: '',
    birthday: '',
    gender: 'male'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [breedOptions, setBreedOptions] = useState([])
  const [speciesOptions, setSpeciesOptions] = useState([])
  const [showCustomBreed, setShowCustomBreed] = useState(false)
  const [showCustomSpecies, setShowCustomSpecies] = useState(false)
  const [customBreed, setCustomBreed] = useState('')
  const [customSpecies, setCustomSpecies] = useState('')

  // Initialize form data when editing
  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        role: pet.role || 'canine',
        breed: pet.breed || '',
        species: pet.species || '',
        colormarking: pet.colormarking || '',
        birthday: pet.birthday || '',
        gender: pet.gender || 'male'
      })
    }
  }, [pet])

  // Fetch breed and species options when role changes
  useEffect(() => {
    fetchBreedOptions(formData.role)
    fetchSpeciesOptions(formData.role)
  }, [formData.role])

  const fetchBreedOptions = async (role) => {
    try {
      const response = await fetch(`/api/pets/breeds/options?role=${role}`)
      const breeds = await response.json()
      setBreedOptions(breeds)
    } catch (error) {
      console.error('Error fetching breeds:', error)
    }
  }

  const fetchSpeciesOptions = async (role) => {
    try {
      const response = await fetch(`/api/pets/species/options?role=${role}`)
      const species = await response.json()
      setSpeciesOptions(species)
    } catch (error) {
      console.error('Error fetching species:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Use custom values if provided
      const submitData = {
        ...formData,
        breed: showCustomBreed ? customBreed : formData.breed,
        species: showCustomSpecies ? customSpecies : formData.species
      }

      let savedPet
      if (pet) {
        savedPet = await petAPI.update(pet.id, submitData)
      } else {
        savedPet = await petAPI.create(submitData)
        
        // If we have a client context, automatically assign the new pet to the client
        if (client && savedPet.id) {
          await clientAPI.assignPet(client.id, savedPet.id)
        }
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving pet:', error)
      setError(error.response?.data?.message || 'Failed to save pet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Reset custom options when role changes
    if (field === 'role') {
      setShowCustomBreed(false)
      setShowCustomSpecies(false)
      setCustomBreed('')
      setCustomSpecies('')
      setFormData(prev => ({ ...prev, breed: '', species: '' }))
    }
  }

  const handleBreedChange = (value) => {
    if (value === 'custom') {
      setShowCustomBreed(true)
      setFormData(prev => ({ ...prev, breed: '' }))
    } else {
      setShowCustomBreed(false)
      setFormData(prev => ({ ...prev, breed: value }))
    }
  }

  const handleSpeciesChange = (value) => {
    if (value === 'custom') {
      setShowCustomSpecies(true)
      setFormData(prev => ({ ...prev, species: '' }))
    } else {
      setShowCustomSpecies(false)
      setFormData(prev => ({ ...prev, species: value }))
    }
  }

  return (
    <div className="h-full w-full p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {pet ? 'Edit Pet' : `Add New Pet${client ? ` for ${client.fullname}` : ''}`}
          </h1>
          <p className="mt-1 text-gray-600">
            {pet ? 'Update pet information' : `Add a new pet${client ? ` and assign to ${client.fullname}` : ' to your clinic records'}`}
          </p>
        </div>
      </div>
      
      {/* Form Card */}
      <Card className="bg-white shadow max-w-4xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
            <HeartIcon className="h-6 w-6" />
            Pet Information
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Please fill in the details below to {pet ? 'update' : 'add'} the pet record.
            {client && !pet && ` This pet will be automatically assigned to ${client.fullname}.`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Pet Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="Enter pet's name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Pet Type *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  disabled={isLoading}
                >
                  <option value="canine">🐕 Canine (Dog)</option>
                  <option value="feline">🐱 Feline (Cat)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Breed
                </label>
                {!showCustomBreed ? (
                  <select
                    value={formData.breed}
                    onChange={(e) => handleBreedChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    disabled={isLoading}
                  >
                    <option value="">Select a breed</option>
                    {breedOptions.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                    <option value="custom">+ Add New Breed</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customBreed}
                      onChange={(e) => setCustomBreed(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Enter custom breed"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCustomBreed(false)}
                      disabled={isLoading}
                      className="px-3"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Species
                </label>
                {!showCustomSpecies ? (
                  <select
                    value={formData.species}
                    onChange={(e) => handleSpeciesChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    disabled={isLoading}
                  >
                    <option value="">Select a species</option>
                    {speciesOptions.map((species) => (
                      <option key={species} value={species}>{species}</option>
                    ))}
                    <option value="custom">+ Add New Species</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSpecies}
                      onChange={(e) => setCustomSpecies(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Enter custom species"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCustomSpecies(false)}
                      disabled={isLoading}
                      className="px-3"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Color & Markings
                </label>
                <textarea
                  value={formData.colormarking}
                  onChange={(e) => handleInputChange('colormarking', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="color and markings"
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Birthday *
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  disabled={isLoading}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  pet ? 'Update Pet' : `Add Pet${client ? ` to ${client.fullname}` : ''}`
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                disabled={isLoading}
                className="px-6 py-3 disabled:opacity-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PetForm
