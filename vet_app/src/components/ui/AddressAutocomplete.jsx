import React, { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import PhilippinesAddressService from '../../services/addressService'

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Enter address", 
  disabled = false,
  required = false,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const searchAddresses = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    
    try {
      // Use the Philippines Address Service
      const addresses = await PhilippinesAddressService.searchAddresses(query)
      setSuggestions(addresses)
    } catch (error) {
      console.error('Error searching addresses:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
    
    if (newValue.length >= 2) {
      setIsOpen(true)
      searchAddresses(newValue)
    } else {
      setIsOpen(false)
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.display)
    onChange(suggestion.display)
    setIsOpen(false)
    setSuggestions([])
  }

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setIsOpen(true)
      searchAddresses(inputValue)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${className}`}
        />
        
        {/* Search Icon */}
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        {/* Loading/Dropdown Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          ) : (
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.type === 'barangay' 
                      ? `${suggestion.barangay}, ${suggestion.city}, ${suggestion.province}`
                      : `${suggestion.city}, ${suggestion.province}`
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && !loading && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <div className="text-sm text-gray-500 text-center">
            No addresses found for "{inputValue}"
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressAutocomplete
