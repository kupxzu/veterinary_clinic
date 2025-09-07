// Address Service Test and Usage Examples

import PhilippinesAddressService from '../services/addressService'

// Example usage of the Philippines Address Service
export const addressExamples = {
  
  // Test searching for addresses
  async testAddressSearch() {
    console.log('Testing Philippines Address Search...')
    
    try {
      // Search for Manila
      const manilaResults = await PhilippinesAddressService.searchAddresses('manila')
      console.log('Manila search results:', manilaResults)
      
      // Search for Cebu
      const cebuResults = await PhilippinesAddressService.searchAddresses('cebu')
      console.log('Cebu search results:', cebuResults)
      
      // Search by region
      const ncrResults = await PhilippinesAddressService.searchAddresses('ncr')
      console.log('NCR search results:', ncrResults)
      
      // Search by ZIP code
      const zipResults = await PhilippinesAddressService.searchAddresses('1000')
      console.log('ZIP 1000 search results:', zipResults)
      
    } catch (error) {
      console.error('Error testing address search:', error)
    }
  },

  // Test getting barangays for a specific city
  testBarangayRetrieval() {
    console.log('Testing Barangay Retrieval...')
    
    // Get barangays for Manila
    const manilaBarangays = PhilippinesAddressService.getBarangays('manila-1000')
    console.log('Manila barangays:', manilaBarangays)
    
    // Get barangays for Quezon City
    const qcBarangays = PhilippinesAddressService.getBarangays('quezon-city-1100')
    console.log('Quezon City barangays:', qcBarangays)
  },

  // Test full address formatting
  testAddressFormatting() {
    console.log('Testing Address Formatting...')
    
    const fullAddress1 = PhilippinesAddressService.formatFullAddress(
      '123 Rizal Street',
      'Barangay Poblacion',
      'Manila',
      'Metro Manila',
      'NCR',
      '1000'
    )
    console.log('Formatted address 1:', fullAddress1)
    
    const fullAddress2 = PhilippinesAddressService.formatFullAddress(
      '456 Mabini Avenue',
      'Lahug',
      'Cebu City',
      'Cebu',
      'Region VII',
      '6000'
    )
    console.log('Formatted address 2:', fullAddress2)
  }
}

// Component usage example for AddressAutocomplete
export const AddressAutocompleteUsageExample = `
// Basic usage in a form
import AddressAutocomplete from './components/ui/AddressAutocomplete'

function MyForm() {
  const [address, setAddress] = useState('')
  
  const handleAddressChange = (selectedAddress) => {
    setAddress(selectedAddress)
    console.log('Selected address:', selectedAddress)
  }

  return (
    <form>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Address *
        </label>
        <AddressAutocomplete
          value={address}
          onChange={handleAddressChange}
          placeholder="Start typing to search for Philippines addresses..."
          required
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          Search by city, province, region, or ZIP code
        </p>
      </div>
    </form>
  )
}

// Advanced usage with detailed address components
function AdvancedAddressForm() {
  const [addressData, setAddressData] = useState({
    street: '',
    barangay: '',
    city: '',
    province: '',
    region: '',
    zipCode: ''
  })

  const handleAddressSelect = (selectedAddress) => {
    // selectedAddress contains: { id, display, city, province, region, zipCode, barangays }
    setAddressData({
      ...addressData,
      city: selectedAddress.city,
      province: selectedAddress.province,
      region: selectedAddress.region,
      zipCode: selectedAddress.zipCode
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label>Street Address</label>
        <input
          type="text"
          value={addressData.street}
          onChange={(e) => setAddressData({...addressData, street: e.target.value})}
          placeholder="House number and street name"
        />
      </div>
      
      <div>
        <label>Barangay</label>
        <input
          type="text"
          value={addressData.barangay}
          onChange={(e) => setAddressData({...addressData, barangay: e.target.value})}
          placeholder="Barangay"
        />
      </div>
      
      <div>
        <label>City/Province/Region</label>
        <AddressAutocomplete
          value={\`\${addressData.city}, \${addressData.province}, \${addressData.region} \${addressData.zipCode}\`}
          onChange={handleAddressSelect}
          placeholder="Search for city, province, region..."
        />
      </div>
    </div>
  )
}
`

// API Integration suggestions
export const apiIntegrationSuggestions = `
// To integrate with real Philippines address APIs, update the PhilippinesAddressService:

1. Philippine Postal Corporation API (if available)
2. Google Places API with Philippines bias
3. OpenStreetMap Nominatim with Philippines filter
4. Custom government address database APIs

Example Google Places integration:
async function searchGooglePlaces(query) {
  const response = await fetch(
    \`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=\${query}&components=country:ph&key=YOUR_API_KEY\`
  )
  const data = await response.json()
  return data.predictions.map(prediction => ({
    id: prediction.place_id,
    display: prediction.description,
    // Parse structured components...
  }))
}

Example OpenStreetMap Nominatim integration:
async function searchNominatim(query) {
  const response = await fetch(
    \`https://nominatim.openstreetmap.org/search?q=\${query}&countrycodes=ph&format=json&limit=10\`
  )
  const data = await response.json()
  return data.map(place => ({
    id: place.osm_id,
    display: place.display_name,
    // Parse address components...
  }))
}
`

export default {
  addressExamples,
  AddressAutocompleteUsageExample,
  apiIntegrationSuggestions
}
