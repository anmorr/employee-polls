import { createSlice,
    createEntityAdapter,
    createAsyncThunk } from '@reduxjs/toolkit'
import { _getQuestions, _saveQuestion, _saveQuestionAnswer } from '../../api/_DATA'

const questionsAdapter = createEntityAdapter()

const initialState = questionsAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const fetchQuestions = createAsyncThunk('questions/fetchQuestions', async () => {
    const response = await _getQuestions()
  return response
})

export const addQuestion = createAsyncThunk('questions/addQuestion', async (question) => {
    const response = await _saveQuestion(question)
  return response
})

export const addAnswer = createAsyncThunk('questions/addQuestionAnswer', async (answer) => {
    const response = await _saveQuestionAnswer(answer)
  return response
})


const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        // questionUpdated(state, action) {
        //     const { id, title, content } = action.payload
        //     const existingPost = state.entities[id]
        //     if (existingPost) {
        //         existingPost.title = title
        //         existingPost.content = content
        //     }
        // }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchQuestions.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.status = 'succeeded'
                questionsAdapter.setAll(state, action.payload)
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // Use the `addOne` reducer for the fulfilled case
            .addCase(addQuestion.fulfilled, questionsAdapter.addOne)
            .addCase(addAnswer.fulfilled, (state, action) => {
                let qid = action.meta.arg.qid
                let option = action.meta.arg.answer
                let authedUser = action.meta.arg.authedUser
                let currentQuestion = state.entities[qid]
                if (currentQuestion) {
                    currentQuestion[option].votes.push(authedUser)
                }
                
                //   let currentQuestion = selectById(state, questionId);
                //   console('currentQuestion: ', currentQuestion)
            })
    }
  })
  
export default questionsSlice.reducer
  
// Export the customized selectors for this adapter using `getSelectors`

export const selectAllQuestionsObject = (state) => {
    return state.questions.entities
}

// export const selectQuestionById = (state, questionId) =>
//     console.log(state.questions)
//   state.questions.entities.find(question => question.id === questionId)

export const {
    selectAll: selectAllQuestions,
    selectById: selectQuestionById,
    selectIds: selectQuestionIds
    // Pass in a selector that returns the questions slice of state
  } = questionsAdapter.getSelectors(state => state.questions)