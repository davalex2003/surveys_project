import {PayloadAction, createSlice} from "@reduxjs/toolkit";

interface EmailSliceType {
    emails: string[];
}

const INITIAL_STATE: EmailSliceType = {
    emails: [],
}

export const emailSlice = createSlice({
    name: 'emailSlice',
    initialState: INITIAL_STATE,
    reducers: {
        addEmail: (state, action: PayloadAction<string>) => {
            state.emails.push(action.payload);
        },
        removeEmail: (state, action: PayloadAction<number>) => {
            if (state.emails.length === 1) {
                state.emails = [];
            } else {
                state.emails.splice(action.payload, 1);
            }
        },
        removeEmails: (state) => {
            state.emails = []
        }
    },
});

export const {addEmail, removeEmail, removeEmails} = emailSlice.actions;
export default emailSlice.reducer;