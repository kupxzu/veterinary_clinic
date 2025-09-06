import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { useBreadcrumb } from '../contexts/BreadcrumbContext'
import { LoadingCard, LoadingSpinner } from './ui/Loading'
import { 
  ArrowLeftIcon,
  PlusIcon,
  PersonIcon,
  HeartIcon,
  TrashIcon
} from '@radix-ui/react-icons'
import { clientAPI } from '../lib/api'
import PetForm from './PetForm'

const ClientPets = ({ client, onBack }) => {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddPetForm, setShowAddPetForm] = useState(false)
  const [removingPet, setRemovingPet] = useState(null)
  const { updateBreadcrumbs } = useBreadcrumb()

  // Memoize the breadcrumb handlers to prevent infinite re-renders
  const handleBackToClientManagement = useCallback(() => {
    onBack()
  }, [onBack])

  const handleBackToPetsList = useCallback(() => {
    setShowAddPetForm(false)
  }, [])

  // Update breadcrumbs when component mounts or showAddPetForm changes
  useEffect(() => {
    if (showAddPetForm) {
      updateBreadcrumbs([
        { label: 'Client Management', onClick: handleBackToClientManagement },
        { label: `${client.fullname}'s Pets`, onClick: handleBackToPetsList },
        { label: 'Add New Pet', href: null }
      ])
    } else {
      updateBreadcrumbs([
        { label: 'Client Management', onClick: handleBackToClientManagement },
        { label: `${client.fullname}'s Pets`, href: null }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.fullname, showAddPetForm])

  useEffect(() => {
    fetchData()
  }, [client.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Get client's pets
      const clientData = await clientAPI.getById(client.id)
      setPets(clientData.pets || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const removePet = async (petId) => {
    if (!confirm('Are you sure you want to remove this pet from the client?')) return
    
    try {
      setRemovingPet(petId)
      await clientAPI.removePet(client.id, petId)
      await fetchData() // Refresh data
    } catch (error) {
      console.error('Error removing pet:', error)
      alert('Failed to remove pet')
    } finally {
      setRemovingPet(null)
    }
  }

  const handleAddPetSuccess = () => {
    setShowAddPetForm(false)
    fetchData() // Refresh data after adding new pet
  }

  const getRoleIcon = (role) => {
    return role === 'canine' ? '🐕' : '🐱'
  }

  const getRoleColor = (role) => {
    return role === 'canine' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
  }

  if (loading) {
    return (
      <div className="h-full w-full p-6">
        <LoadingCard 
          title="Loading Client Pets..." 
          description={`Loading pet records for ${client.fullname}`}
        />
      </div>
    )
  }

  // If showing add pet form, render the form
  if (showAddPetForm) {
    return (
      <PetForm
        client={client}
        onBack={() => setShowAddPetForm(false)}
        onSuccess={handleAddPetSuccess}
      />
    )
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
          <h1 className="text-3xl font-bold text-gray-900">{client.fullname}'s Pets</h1>
          <p className="mt-1 text-gray-600">
            Manage pets for {client.fullname} • {client.email}
          </p>
        </div>
      </div>

      {/* Client Info Card */}
      <Card className="bg-white shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
            <PersonIcon className="h-6 w-6" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg text-gray-900">{client.fullname}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{client.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-lg text-gray-900">{client.number || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pets</p>
              <p className="text-lg text-gray-900">{pets.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Pets */}
      <Card className="bg-white shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                <HeartIcon className="h-6 w-6" />
                Current Pets ({pets.length})
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Pets currently assigned to this client
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowAddPetForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Pet
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <div className="text-center py-8">
              <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pets assigned yet</h3>
              <p className="text-gray-600 mb-4">
                This client doesn't have any pets yet. Add a new pet to get started.
              </p>
              <Button
                onClick={() => setShowAddPetForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add First Pet
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet) => (
                <div key={pet.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getRoleIcon(pet.role)}</span>
                      <h4 className="font-semibold text-gray-900">{pet.name}</h4>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePet(pet.id)}
                      disabled={removingPet === pet.id}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {removingPet === pet.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <TrashIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
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
                        <p><strong>Markings:</strong> <span className="text-gray-500">{pet.colormarking.length > 30 ? pet.colormarking.substring(0, 30) + '...' : pet.colormarking}</span></p>
                      )}
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

export default ClientPets
