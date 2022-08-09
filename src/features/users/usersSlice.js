import { createSlice,
    createEntityAdapter,
    createAsyncThunk } from '@reduxjs/toolkit'
import { _getUsers } from '../../api/_DATA'


export function compare(a, b) {
  if ((Object.keys(a.answers).length + a.questions.length) < (Object.keys(b.answers).length + b.questions.length)) {
    return 1
  }
  if ((Object.keys(a.answers).length + a.questions.length) > (Object.keys(b.answers).length + b.questions.length)) {
    return -1
  }
  return 0
  
}
const usersAdapter = createEntityAdapter({
  sortComparer: compare
})

const initialState = usersAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await _getUsers()
  return response
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userUpdated(state, action) {
      const { uid, qid, option} = action.payload
      const existingUser = state.entities[uid]
      if (existingUser) {
        existingUser.answers[qid] = option
      }
    },
    addQuestionToUser(state, action) {
      const { id, author} = action.payload
      const existingUser = state.entities[author]
      if (existingUser) {
        existingUser.questions.push(id)
      }
    }
  },
  extraReducers(builder) {
    // builder.addCase(fetchUsers.fulfilled, (state, action) => {
    //   return action.payload
    // })
    builder
        .addCase(fetchUsers.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = 'succeeded'
            usersAdapter.setAll(state, action.payload)
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
  }
})

export default usersSlice.reducer

export const { userUpdated, addQuestionToUser } = usersSlice.actions


// export const selectUserById = (state, userId) =>
//   state.users.entities.find(user => user.id === userId)
export const selectAllUsersObject = (state) => {
  return state.users.entities
}

export const { 
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds} =
  usersAdapter.getSelectors(state => state.users)