import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { useBreadcrumb } from '../contexts/BreadcrumbContext'
import { LoadingCard } from './ui/Loading'
import { PersonIcon, PlusIcon } from '@radix-ui/react-icons'
import ClientList from './ClientList'
import ClientForm from './ClientForm'
import ClientPets from './ClientPets'

const ClientManagement = () => {
  const [view, setView] = useState('list') // 'list', 'form', 'pets'
  const [selectedClient, setSelectedClient] = useState(null)
  const [editingClient, setEditingClient] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { updateBreadcrumbs } = useBreadcrumb()

  // Update breadcrumbs based on current view
  React.useEffect(() => {
    if (view === 'list') {
      updateBreadcrumbs([
        { label: 'Client Management', href: null }
      ])
    } else if (view === 'form') {
      updateBreadcrumbs([
        { label: 'Client Management', onClick: () => setView('list') },
        { label: editingClient ? 'Edit Client' : 'Create New Client', href: null }
      ])
    } else if (view === 'pets' && selectedClient) {
      updateBreadcrumbs([
        { label: 'Client Management', onClick: () => setView('list') },
        { label: `${selectedClient.fullname}'s Pets`, href: null }
      ])
    }
  }, [view, selectedClient, editingClient])

  const handleSelectClient = (client) => {
    setSelectedClient(client)
    setView('pets')
  }

  const handleCreateClient = () => {
    setEditingClient(null)
    setView('form')
  }

  const handleEditClient = (client) => {
    setEditingClient(client)
    setView('form')
  }

  const handleDeleteClient = (clientId) => {
    // Client is already deleted in ClientList component
    // This callback can be used for any additional cleanup if needed
    console.log('Client deleted:', clientId)
  }

  const handleClientCreated = () => {
    setView('list')
    setEditingClient(null)
  }

  const handleBack = () => {
    setView('list')
    setSelectedClient(null)
    setEditingClient(null)
  }

  if (isLoading) {
    return (
      <div className="h-full w-full p-6">
        <LoadingCard 
          title="Loading Client Management..." 
          description="Please wait while we load your client data"
        />
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6 space-y-6 overflow-y-auto">
      {view === 'list' && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
              <p className="mt-1 text-gray-600">
                Select a client to manage their pets, or create a new client
              </p>
            </div>
            <Button
              onClick={handleCreateClient}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Client
            </Button>
          </div>

          {/* Client List Card */}
          <Card className="bg-white shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                <PersonIcon className="h-6 w-6" />
                Client Directory
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Browse and select clients to manage their pet records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientList 
                onSelectClient={handleSelectClient} 
                onEditClient={handleEditClient}
                onDeleteClient={handleDeleteClient}
              />
            </CardContent>
          </Card>
        </>
      )}

      {view === 'form' && (
        <>
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h1>
              <p className="mt-1 text-gray-600">
                {editingClient ? 'Update client information' : 'Create a new client profile to manage their pets'}
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="bg-white shadow max-w-4xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                <PersonIcon className="h-6 w-6" />
                Client Information
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                {editingClient ? 'Update the client details below' : 'Please fill in the client\'s details below'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientForm
                client={editingClient}
                onSuccess={handleClientCreated}
                onCancel={handleBack}
              />
            </CardContent>
          </Card>
        </>
      )}

      {view === 'pets' && selectedClient && (
        <ClientPets
          client={selectedClient}
          onBack={handleBack}
        />
      )}
    </div>
  )
}

export default ClientManagement
