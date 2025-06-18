import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { create, read, update, remove } from '@/api/todoApi'

const initialState = {
    value: [],
    status: 'idle'
}
export const loadTodoAsync = createAsyncThunk(
    'todo/loadTodo',
    async () => {
        try {
            const { data } = await read()
            return data?.data
        } catch (e) {
            console.log('gagal')
        }
    }
)

export const createTodoAsync = createAsyncThunk(
    'todo/createTodo',
    async (todo, { rejectWithValue }) => {
        try {
            const { data } = await create(todo.title)
            return { _id: todo._id, todo: data }
        } catch (e) {
            console.log('gagal tambah', e, todo._id)
            return rejectWithValue(todo._id)
        }
    }
)

export const removeTodoAsync = createAsyncThunk(
    'todo/removeTodo',
    async _id => {
        try {
            const { data } = await remove(_id)
            return data._id
        } catch (error) {
            console.log('gagal delete', e)
        }
    }
)

export const resendTodoAsync = createAsyncThunk(
    'todo/resendTodo',
    async todo => {
        try {
            const { data } = await create(todo.title)
            return { oldId: todo._id, newId: data._id }
        } catch (error) {
            console.log('gagal delete', e)
        }
    }
)

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        add: (state, action) => {
            state.value = [...state.value, action.payload]
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadTodoAsync.pending, state => {
                state.status = 'loading'
            })
            .addCase(loadTodoAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.value = action.payload.map(todo => ({ ...todo, sent: true }))
            })
            .addCase(createTodoAsync.rejected, (state, action) => {
                state.status = 'idle'
                state.value = state.value.map(todo => {
                    if (todo._id == action.payload)
                        todo.sent = false
                    return todo
                })
            })
            .addCase(createTodoAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.value = state.value.map(todo => {
                    if (todo._id == action.payload._id)
                        todo._id = action.payload.todo._id
                    return todo
                })
            })
            .addCase(removeTodoAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.value = state.value.filter(todo => todo._id !== action.payload)
            })
            .addCase(resendTodoAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.value = state.value.map(todo => {
                    if (todo._id == action.payload.oldId) {
                        todo._id = action.payload.newId
                        todo.sent = true
                    }
                    return todo
                })
            })
    }
})


export const { add } = todoSlice.actions

export const getTodos = state => state.todo.value

export const addTodo = title => (dispatch) => {
    const _id = Date.now()
    const todo = { _id, title, complete: false, sent: true }
    dispatch(add(todo))
    dispatch(createTodoAsync(todo))
}

export default todoSlice.reducer