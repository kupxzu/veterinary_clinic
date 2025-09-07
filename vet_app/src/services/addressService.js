// Philippines Address API Service
// This can be enhanced to use real APIs like:
// - Philippine Postal Corporation API
// - Google Places API (Philippines)
// - Nominatim (OpenStreetMap) for Philippines

export class PhilippinesAddressService {
  static async searchAddresses(query) {
    // Mock API call - replace with real API
    return new Promise((resolve) => {
      setTimeout(() => {
        const allAddresses = this.getLocalAddresses()
        const results = []
        
        // Search in city/province names
        const cityMatches = allAddresses.filter(address => 
          address.display.toLowerCase().includes(query.toLowerCase())
        )
        
        // Search in barangays
        const barangayMatches = []
        allAddresses.forEach(address => {
          if (address.barangays) {
            address.barangays.forEach(barangay => {
              if (barangay.toLowerCase().includes(query.toLowerCase())) {
                barangayMatches.push({
                  id: `${address.id}-${barangay.toLowerCase().replace(/\s+/g, '-')}`,
                  display: `${barangay}, ${address.city}, ${address.province}`,
                  city: address.city,
                  province: address.province,
                  region: address.region,
                  zipCode: address.zipCode,
                  barangay: barangay,
                  type: 'barangay'
                })
              }
            })
          }
        })
        
        // Prioritize Tuguegarao results first
        const tuguegaraoResults = [...cityMatches, ...barangayMatches].filter(result => 
          result.city.toLowerCase().includes('tuguegarao')
        )
        const otherResults = [...cityMatches, ...barangayMatches].filter(result => 
          !result.city.toLowerCase().includes('tuguegarao')
        )
        
        // Combine with Tuguegarao first, then others, limit to 10
        const prioritizedResults = [...tuguegaraoResults, ...otherResults].slice(0, 10)
        
        resolve(prioritizedResults)
      }, 300) // Simulate API delay
    })
  }

  static getLocalAddresses() {
    return [
      // Metro Manila
      { 
        id: 'manila-1000', 
        display: 'Manila, Metro Manila',
        city: 'Manila', 
        province: 'Metro Manila', 
        region: 'NCR', 
        zipCode: '1000',
        barangays: ['Ermita', 'Intramuros', 'Malate', 'Paco', 'Pandacan', 'Port Area', 'Quiapo', 'Sampaloc', 'San Andres', 'San Miguel', 'San Nicolas', 'Santa Ana', 'Santa Cruz', 'Santa Mesa', 'Tondo', 'Binondo']
      },
      {
        id: 'quezon-city-1100',
        display: 'Quezon City, Metro Manila',
        city: 'Quezon City',
        province: 'Metro Manila',
        region: 'NCR',
        zipCode: '1100',
        barangays: ['Bagong Pag-asa', 'Bahay Toro', 'Balingasa', 'Bungad', 'Central', 'Commonwealth', 'Diliman', 'Fairview', 'Kamias', 'Kamuning', 'La Loma', 'Libis', 'Malinta', 'Novaliches Proper', 'Project 4', 'Roxas', 'Sacred Heart', 'San Francisco', 'Sienna', 'Tandang Sora', 'Ugong Norte', 'Veterans Village', 'West Triangle']
      },
      {
        id: 'makati-1200',
        display: 'Makati, Metro Manila',
        city: 'Makati',
        province: 'Metro Manila',
        region: 'NCR',
        zipCode: '1200',
        barangays: ['Bangkal', 'Bel-Air', 'Carmona', 'Cembo', 'Comembo', 'Dasmarinas', 'East Rembo', 'Forbes Park', 'Guadalupe Nuevo', 'Guadalupe Viejo', 'Kasilawan', 'La Paz', 'Magallanes', 'Olympia', 'Palanan', 'Pembo', 'Pinagkaisahan', 'Pio del Pilar', 'Poblacion', 'Post Proper Northside', 'Post Proper Southside', 'Rizal', 'San Antonio', 'San Isidro', 'San Lorenzo', 'Santa Cruz', 'Singkamas', 'South Cembo', 'Tejeros', 'Urdaneta', 'Valenzuela', 'West Rembo']
      },

      // Provincial Cities
      {
        id: 'cebu-city-6000',
        display: 'Cebu City, Cebu',
        city: 'Cebu City',
        province: 'Cebu',
        region: 'Region VII',
        zipCode: '6000',
        barangays: ['Apas', 'Busay', 'Calamba', 'Capitol Site', 'Carreta', 'Day-as', 'Guadalupe', 'Kamputhaw', 'Kasambagan', 'Lahug', 'Mabolo', 'Malubog', 'Parian', 'Poblacion Pardo', 'Pulangbato', 'Sambag I', 'Sambag II', 'San Nicolas Proper', 'Santa Cruz', 'Santo Niño', 'Sirao', 'Talamban', 'Tisa', 'Zapatera']
      },
      {
        id: 'davao-city-8000',
        display: 'Davao City, Davao del Sur',
        city: 'Davao City',
        province: 'Davao del Sur',
        region: 'Region XI',
        zipCode: '8000',
        barangays: ['1-A', '2-A', '3-A', '4-A', '5-A', '6-A', '7-A', '8-A', '9-A', '10-A', 'Agdao', 'Bago Aplaya', 'Bago Gallera', 'Baguio', 'Bangkas Heights', 'Biao Escuela', 'Buhangin', 'Bunawan', 'Catalunan Grande', 'Catalunan Pequeño', 'Cavo', 'Daliao', 'Dumoy', 'Eden', 'Ilang', 'Lanang', 'Lubogan', 'Ma-a', 'Matina Aplaya', 'Matina Crossing', 'Matina Pangi', 'Mintal', 'Mudiang', 'Mulig', 'New Carmen', 'New Valencia', 'Pampanga', 'Panacan', 'Piapi', 'Rafael Castillo', 'Riverside', 'San Antonio', 'Sirawan', 'Siyara', 'Tagurano', 'Talomo', 'Tamugan', 'Tigatto', 'Toril', 'Tugbok', 'Ula', 'Waan']
      },
      {
        id: 'iloilo-city-5000',
        display: 'Iloilo City, Iloilo',
        city: 'Iloilo City',
        province: 'Iloilo',
        region: 'Region VI',
        zipCode: '5000',
        barangays: ['Arevalo', 'Bo. Obrero', 'Buhang', 'City Proper', 'Jaro', 'La Paz', 'Lapuz', 'Mandurriao', 'Molo', 'San Jose', 'Villa Arevalo']
      },

      // More cities across regions
      {
        id: 'baguio-2600',
        display: 'Baguio, Benguet',
        city: 'Baguio',
        province: 'Benguet',
        region: 'CAR',
        zipCode: '2600',
        barangays: ['Abanao-Zandueta-Kayong-Chugum-Otek', 'Alfonso Tabora', 'Ambiong', 'Andres Bonifacio', 'Apugan-Loakan', 'Aurora Hill Proper', 'Aurora Hill, North Central', 'Aurora Hill, South Central', 'Bagong Lipunan', 'Bakakeng Central', 'Bakakeng Norte', 'Bal-Marcoville', 'Balsigan', 'Bayan Park East', 'Bayan Park Village', 'Bayan Park West', 'BGH Compound', 'Brookside', 'Brookspoint', 'Cabinet Hill-Teacher\'s Camp', 'Camdas Subdivision', 'Camp 7', 'Camp 8', 'Camp Allen', 'Campo Filipino', 'Country Club Village', 'Cresencia Village', 'Dizon Subdivision', 'Dominican Hill-Mirador', 'DPS Area', 'Engineers\' Hill', 'Fairview Village', 'Ferdinand', 'Field General Luna', 'Fort del Pilar', 'General Emilio F. Aguinaldo', 'General Luna, Upper', 'Gibraltar', 'Greenwater Village', 'Guisad Central', 'Guisad Sorong', 'Harrison-Claudio Carantes', 'Hillside', 'Holy Ghost Extension', 'Holy Ghost Proper', 'Honeymoon', 'Imelda R. Marcos', 'Imelda Village', 'Irisan', 'Kabayanihan', 'Kagitingan', 'Kayang Extension West', 'Kayang-Hilltop', 'Kias', 'Legarda-Burnham-Kisad', 'Lourdes Subdivision Extension', 'Lourdes Subdivision Proper', 'Loakan Proper', 'Lopez Jaena', 'Lucnab', 'Lualhati', 'Malcom Square-Perfecto', 'Magsaysay Private Road', 'Magsaysay, Lower', 'Magsaysay, Upper', 'Malcolm Square-Perfecto', 'Manual A. Roxas', 'Market Subdivision, Upper', 'Middle Quezon Hill Subdivision', 'Military Cut-off', 'Mines View Park', 'Modern Site, East', 'Modern Site, West', 'MRR-Queen of Peace', 'New Lucban', 'Outlook Drive', 'Pacdal', 'Padre Burgos', 'Padre Zamora', 'Palma-Urbano', 'Phil-Am', 'Pinget', 'Poliwes', 'Pucsusan', 'Quezon Hill Proper', 'Quezon Hill, Upper', 'Quirino Hill, East', 'Quirino Hill, Lower', 'Quirino Hill, Middle', 'Quirino Hill, West', 'Quirino-Magsaysay, Upper', 'Rizal Monument Area', 'Rock Quarry, Lower', 'Rock Quarry, Middle', 'Rock Quarry, Upper', 'Salud Mitra', 'San Antonio Village', 'San Luis Village', 'San Roque Village', 'Sanitary Camp, North', 'Sanitary Camp, South', 'Santa Scholastica', 'Santo Rosario', 'Santo Tomas Proper', 'SLU-SVP Housing Village', 'South Drive', 'Teodora Alonzo', 'Trancoville', 'Victoria Village', 'West Quirino Hill']
      },
      {
        id: 'tuguegarao-3500',
        display: 'Tuguegarao City, Cagayan',
        city: 'Tuguegarao City',
        province: 'Cagayan',
        region: 'Region II',
        zipCode: '3500',
        barangays: ['Annafunan East', 'Annafunan West', 'Atulayan Norte', 'Atulayan Sur', 'Bagay', 'Buntun', 'Caggay', 'Capatan', 'Carig', 'Carig Sur', 'Caritan Centro', 'Caritan Norte', 'Caritan Sur', 'Cataggaman Nuevo', 'Cataggaman Pardo', 'Cataggaman Viejo', 'Centro 1 (Poblacion)', 'Centro 2 (Poblacion)', 'Centro 3 (Poblacion)', 'Centro 4 (Poblacion)', 'Centro 5 (Poblacion)', 'Centro 6 (Poblacion)', 'Centro 7 (Poblacion)', 'Centro 8 (Poblacion)', 'Centro 9 (Poblacion)', 'Centro 10 (Poblacion)', 'Centro 11 (Poblacion)', 'Centro 12 (Poblacion)', 'Dadda', 'Gosi Norte', 'Gosi Sur', 'Larion Alto', 'Larion Bajo', 'Leonarda', 'Libag Norte', 'Libag Sur', 'Linao East', 'Linao Norte', 'Linao West', 'Namabbalan Norte', 'Namabbalan Sur', 'Pallua Norte', 'Pallua Sur', 'Pengue-Ruyu', 'Reyes', 'San Gabriel', 'Tagga', 'Tanza', 'Ugac Norte', 'Ugac Sur']
      }
    ]
  }

  // Method to get barangays for a specific city
  static getBarangays(cityId) {
    const city = this.getLocalAddresses().find(addr => addr.id === cityId)
    return city ? city.barangays : []
  }

  // Method to format full address
  static formatFullAddress(streetAddress, barangay, city, province, region, zipCode) {
    const parts = [streetAddress, barangay, city, province, region, zipCode].filter(Boolean)
    return parts.join(', ')
  }
}

export default PhilippinesAddressService
