import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL || 'http://vet.api:7000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/admin/login', credentials)
    return response.data
  },
  
  logout: async () => {
    const response = await api.post('/api/admin/logout')
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/api/admin/profile')
    return response.data
  }
}

// Pet API functions (updated endpoint from vet-pet to pets)
export const petAPI = {
  getAll: async () => {
    const response = await api.get('/api/pets')
    return response.data // This returns the Laravel response which might have a 'data' property
  },
  
  create: async (petData) => {
    const response = await api.post('/api/pets', petData)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/pets/${id}`)
    return response.data
  },
  
  update: async (id, petData) => {
    const response = await api.put(`/api/pets/${id}`, petData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/pets/${id}`)
    return response.data
  }
}

// Client API functions
export const clientAPI = {
  getAll: async () => {
    const response = await api.get('/api/clients')
    return response.data
  },
  
  create: async (clientData) => {
    const response = await api.post('/api/clients', clientData)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/clients/${id}`)
    return response.data
  },
  
  update: async (id, clientData) => {
    const response = await api.put(`/api/clients/${id}`, clientData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/clients/${id}`)
    return response.data
  },
  
  assignPet: async (clientId, petId) => {
    const response = await api.post(`/api/clients/${clientId}/assign-pet`, { pet_id: petId })
    return response.data
  },
  
  removePet: async (clientId, petId) => {
    const response = await api.delete(`/api/clients/${clientId}/pets/${petId}`)
    return response.data
  }
}

// Vaccination Schedule API functions
export const vaccinationAPI = {
  getAll: async () => {
    const response = await api.get('/api/vaccination-schedules')
    return response.data
  },
  
  getTodaysSchedules: async () => {
    const response = await api.get('/api/vaccination-schedules/todays/schedules')
    return response.data
  },
  
  create: async (vaccinationData) => {
    const response = await api.post('/api/vaccination-schedules', vaccinationData)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/vaccination-schedules/${id}`)
    return response.data
  },
  
  update: async (id, vaccinationData) => {
    const response = await api.put(`/api/vaccination-schedules/${id}`, vaccinationData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/vaccination-schedules/${id}`)
    return response.data
  },
  
  getByPet: async (petId) => {
    const response = await api.get(`/api/pets/${petId}/vaccinations`)
    return response.data
  },
  
  attachPet: async (vaccinationId, petId) => {
    const response = await api.post(`/api/vaccination-schedules/${vaccinationId}/attach-pet`, { pet_id: petId })
    return response.data
  },
  
  detachPet: async (vaccinationId, petId) => {
    const response = await api.delete(`/api/vaccination-schedules/${vaccinationId}/pets/${petId}`)
    return response.data
  },

  // New medical service methods
  getServiceTypes: async () => {
    const response = await api.get('/api/vaccination-schedules/options/services')
    return response.data
  },

  getStatusOptions: async () => {
    const response = await api.get('/api/vaccination-schedules/options/statuses')
    return response.data
  },

  getByService: async (serviceType) => {
    const response = await api.get(`/api/vaccination-schedules/service/${serviceType}`)
    return response.data
  },

  getByStatus: async (status) => {
    const response = await api.get(`/api/vaccination-schedules/status/${status}`)
    return response.data
  },

  getUpcomingFollowUps: async () => {
    const response = await api.get('/api/vaccination-schedules/follow-ups/upcoming')
    return response.data
  },

  markCompleted: async (id) => {
    const response = await api.patch(`/api/vaccination-schedules/${id}/mark-completed`)
    return response.data
  },

  markCancelled: async (id) => {
    const response = await api.patch(`/api/vaccination-schedules/${id}/mark-cancelled`)
    return response.data
  }
}

export default api
