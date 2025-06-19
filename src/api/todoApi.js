import { request } from "./request"

export const read = () => request.get('todos')

export const create = title => request.post('todos', { title })

export const update = ({ id, title, complete }) => request.put(`todos/${id}`, { title, complete })

export const remove = id => request.delete(`todos/${id}`)

