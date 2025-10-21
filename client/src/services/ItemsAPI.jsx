import { http } from './http'
export const listItems = () => http('/items')
export const getItem = (id) => http(`/items/${id}`)
export const createItem = (payload) => http('/items', { method: 'POST', body: JSON.stringify(payload) })
export const updateItem = (id, payload) => http(`/items/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
export const deleteItem = (id) => http(`/items/${id}`, { method: 'DELETE' })
