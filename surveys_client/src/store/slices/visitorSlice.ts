import {PayloadAction, createSlice} from "@reduxjs/toolkit";

interface VisitorSliceType {
    visitors: string[];
}

const INITIAL_STATE: VisitorSliceType = {
    visitors: [],
}

export const visitorSlice = createSlice({
    name: 'visitorSlice',
    initialState: INITIAL_STATE,
    reducers: {
        addVisitor: (state, action: PayloadAction<string>) => {
            state.visitors.push(action.payload);
        },
        removeVisitor: (state, action: PayloadAction<number>) => {
            if (state.visitors.length === 1) {
                state.visitors = [];
            } else {
                state.visitors.splice(action.payload, 1);
            }
        },
        removeVisitors: (state) => {
            state.visitors = []
        }
    },
});

export const {addVisitor, removeVisitor, removeVisitors} = visitorSlice.actions;
export default visitorSlice.reducer;