import {configureStore} from "@reduxjs/toolkit";
import questionSlice from "./slices/questionSlice";
import emailSlice from "./slices/emailSlice"
import visitorSlice from "./slices/visitorSlice";
export const store = configureStore({
    reducer: {question: questionSlice, email: emailSlice, visitor: visitorSlice}
});

export type RootState = ReturnType<typeof store.getState>