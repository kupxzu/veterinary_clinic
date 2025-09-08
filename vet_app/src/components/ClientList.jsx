import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from './ui/Loading'
import { PersonIcon, ChevronRightIcon, Pencil1Icon, TrashIcon, MagnifyingGlassIcon, ChevronLeftIcon } from '@radix-ui/react-icons'
import { Button } from './ui/Button'
import { clientAPI } from '../lib/api'

const ClientList = ({ onSelectClient, onEditClient, onDeleteClient }) => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredClients, setFilteredClients] = useState([])
  
  const ITEMS_PER_PAGE = 15

  useEffect(() => {
    fetchClients()
  }, [])

  // Filter clients based on search term
  useEffect(() => {
    const filtered = clients.filter(client => 
      client.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.number && client.number.includes(searchTerm)) ||
      (client.address && client.address.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredClients(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [clients, searchTerm])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const data = await clientAPI.getAll()
      setClients(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      setError('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (clientId, clientName) => {
    if (!window.confirm(`Are you sure you want to delete ${clientName}? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingId(clientId)
      await clientAPI.delete(clientId)
      const updatedClients = clients.filter(client => client.id !== clientId)
      setClients(updatedClients)
      if (onDeleteClient) {
        onDeleteClient(clientId)
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete client. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (e, client) => {
    e.stopPropagation()
    if (onEditClient) {
      onEditClient(client)
    }
  }

  const handleDeleteClick = (e, client) => {
    e.stopPropagation()
    handleDelete(client.id, client.fullname)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentClients = filteredClients.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <LoadingSpinner />
          <span className="text-gray-600">Loading clients...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <PersonIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="font-medium">{error}</p>
        </div>
        <button
          onClick={fetchClients}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <PersonIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
        <p className="text-gray-600">Get started by adding your first client to the system.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search clients by name, email, phone, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredClients.length)} of {filteredClients.length} clients
          {searchTerm && ` (filtered from ${clients.length} total)`}
        </span>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Client List */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600">
            {searchTerm ? `No clients match "${searchTerm}". Try a different search term.` : 'No clients available.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {currentClients.map((client) => (
        <div
          key={client.id}
          className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <div 
            className="flex items-center gap-4 flex-1 cursor-pointer"
            onClick={() => onSelectClient(client)}
          >
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <PersonIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {client.fullname}
              </h4>
              <p className="text-sm text-gray-600">{client.email}</p>
              {client.number && (
                <p className="text-sm text-gray-500">{client.number}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleEdit(e, client)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Edit client"
            >
              <Pencil1Icon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleDeleteClick(e, client)}
              disabled={deletingId === client.id}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:border-red-300"
              title="Delete client"
            >
              {deletingId === client.id ? (
                <LoadingSpinner className="h-4 w-4" />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
            </Button>
            
            <ChevronRightIcon 
              className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors cursor-pointer ml-2" 
              onClick={() => onSelectClient(client)}
            />
          </div>
        </div>
      ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageClick(pageNumber)}
                className={`w-8 h-8 p-0 ${
                  currentPage === pageNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ClientList
