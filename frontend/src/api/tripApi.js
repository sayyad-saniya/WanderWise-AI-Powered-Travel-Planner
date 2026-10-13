import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export async function createTrip(payload) {
  const { data } = await client.post('/api/trips', payload)
  return data
}

export async function getTrip(token) {
  const { data } = await client.get(`/api/trips/${token}`)
  return data
}

export async function updateTripDays(token, days) {
  const { data } = await client.put(`/api/trips/${token}/days`, { days })
  return data
}
