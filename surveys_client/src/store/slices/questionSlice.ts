import {PayloadAction, createSlice} from "@reduxjs/toolkit";

interface QuestionSliceType {
    questions: string[];
}

const INITIAL_STATE: QuestionSliceType = {
    questions: [],
}

export const questionSlice = createSlice({
    name: 'questionSlice',
    initialState: INITIAL_STATE,
    reducers: {
        addQuestion: (state, action: PayloadAction<string>) => {
            state.questions.push(action.payload);
        },
        removeQuestion: (state, action: PayloadAction<number>) => {
            if (state.questions.length === 1) {
                state.questions = [];
            } else {
                state.questions.splice(action.payload, 1);
            }
        },
        removeQuestions: (state) => {
            state.questions = []
        }
    },
});

export const {addQuestion, removeQuestion, removeQuestions} = questionSlice.actions;
export default questionSlice.reducer;