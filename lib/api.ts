// Single source of truth for the backend origin.
// Set NEXT_PUBLIC_API_BASE when the API is not on localhost:8000.
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000').replace(/\/+$/, '')
