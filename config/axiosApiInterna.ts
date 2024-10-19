import axios, { AxiosInstance } from 'axios'
import { auth } from '@/config/auth'

export const axiosApiInterna: AxiosInstance = axios.create({
  baseURL: process.env.API_SERVICE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosApiInterna.interceptors.request.use(
  async (config) => {
    const session = await auth()
    config.headers.Authorization = `Bearer ${session?.user.id_token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosApiInterna.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('No autorizado, redirigiendo al login...')
    }
    return Promise.reject(error)
  }
)
