import React, { useState } from 'react'
import { Button } from './ui/Button'
import { LoadingSpinner } from './ui/Loading'
import AddressAutocomplete from './ui/AddressAutocomplete'
import { clientAPI } from '../lib/api'

const ClientForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    number: '',
    address: '',
    age: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await clientAPI.create(formData)
      onSuccess()
    } catch (error) {
      console.error('Error creating client:', error)
      setError(error.response?.data?.message || 'Failed to create client. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddressChange = (address) => {
    setFormData({
      ...formData,
      address: address
    })
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter full name"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter email address"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Phone Number *
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter phone number"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter age"
              disabled={loading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              Address *
            </label>
            <AddressAutocomplete
              value={formData.address}
              onChange={handleAddressChange}
              placeholder="Start typing to search for Philippines addresses..."
              disabled={loading}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Search by city, province, region, or ZIP code
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Creating Client...
              </div>
            ) : (
              'Create Client'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 disabled:opacity-50"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ClientForm
