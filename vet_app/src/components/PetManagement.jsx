
import React, { useState } from 'react'
import PetList from './PetList'
import PetForm from './PetForm'

const PetManagement = () => {
  const [currentView, setCurrentView] = useState('list') 
  const [editingPet, setEditingPet] = useState(null)

  const handleCreatePet = () => {
    setEditingPet(null)
    setCurrentView('create')
  }

  const handleEditPet = (pet) => {
    setEditingPet(pet)
    setCurrentView('edit')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setEditingPet(null)
  }

  const handleSuccess = () => {
    setCurrentView('list')
    setEditingPet(null)
  }

  switch (currentView) {
    case 'create':
    case 'edit':
      return (
        <PetForm
          pet={editingPet}
          onBack={handleBackToList}
          onSuccess={handleSuccess}
        />
      )
    case 'list':
    default:
      return (
        <PetList
          onCreatePet={handleCreatePet}
          onEditPet={handleEditPet}
        />
      )
  }
}

export default PetManagement