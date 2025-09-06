import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Breadcrumb } from './ui/Breadcrumb'
import { petAPI } from '../lib/api'
import { 
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  HeartIcon
} from '@radix-ui/react-icons'

const PetList = ({ onCreatePet, onEditPet }) => {
  const [pets, setPets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      setIsLoading(true)
      const response = await petAPI.getAll()
      console.log('API Response:', response)
      
      // Handle different possible response structures
      let petsData = []
      if (Array.isArray(response)) {
        // If response is directly an array
        petsData = response
      } else if (response.data && Array.isArray(response.data)) {
        // If response has a data property with array
        petsData = response.data
      } else if (response && typeof response === 'object') {
        // If response is an object, check for common Laravel patterns
        petsData = response.pets || response.data || []
      }
      
      console.log('Final pets data:', petsData)
      setPets(petsData)
    } catch (error) {
      console.error('Error fetching pets:', error)
      setError('Failed to load pets: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (petId) => {
    if (!confirm('Are you sure you want to delete this pet?')) return

    try {
      await petAPI.delete(petId)
      setPets(pets.filter(pet => pet.id !== petId))
    } catch (error) {
      console.error('Error deleting pet:', error)
      alert('Failed to delete pet')
    }
  }

  const getRoleIcon = (role) => {
    return role === 'canine' ? '🐕' : '🐱'
  }

  const getRoleColor = (role) => {
    return role === 'canine' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  if (isLoading) {
    return (
      <div className="h-full w-full p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6 space-y-6 overflow-y-auto">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Add Pet', href: null }
        ]} 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Management</h1>
          <p className="mt-1 text-gray-600">
            Manage your clinic's pet records
          </p>
        </div>
        <Button 
          onClick={onCreatePet}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add New Pet
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <Card className="bg-white shadow">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HeartIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by adding your first pet to the clinic.
            </p>
            <Button 
              onClick={onCreatePet}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Your First Pet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Card key={pet.id} className="bg-white shadow hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{getRoleIcon(pet.role)}</span>
                    {pet.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPet(pet)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil1Icon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pet.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getRoleColor(pet.role)}>
                    {pet.role === 'canine' ? 'Canine' : 'Feline'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {pet.gender}
                  </Badge>
                  {pet.breed && (
                    <Badge variant="outline" className="text-xs">
                      {pet.breed}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  {pet.species && (
                    <p><strong>Species:</strong> {pet.species}</p>
                  )}
                  <p><strong>Birthday:</strong> {new Date(pet.birthday).toLocaleDateString()}</p>
                  <p><strong>Age:</strong> {Math.floor((new Date() - new Date(pet.birthday)) / (365.25 * 24 * 60 * 60 * 1000))} years</p>
                  {pet.colormarking && (
                    <p><strong>Markings:</strong> <span className="text-gray-500">{pet.colormarking.length > 50 ? pet.colormarking.substring(0, 50) + '...' : pet.colormarking}</span></p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PetList
