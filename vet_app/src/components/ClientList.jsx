import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from './ui/Loading'
import { PersonIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { clientAPI } from '../lib/api'

const ClientList = ({ onSelectClient }) => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClients()
  }, [])

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
    <div className="space-y-2">
      {clients.map((client) => (
        <div
          key={client.id}
          onClick={() => onSelectClient(client)}
          className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <div className="flex items-center gap-4">
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
          <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      ))}
    </div>
  )
}

export default ClientList
