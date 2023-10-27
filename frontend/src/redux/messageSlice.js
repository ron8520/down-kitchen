import { createSlice } from "@reduxjs/toolkit";

/**
 * A global message state, used for message notification
 * @type {Slice<{type: string, open: boolean, info: string},
 * {setMessage: reducers.setMessage, close: reducers.close}, string>}
 */
export const messageSlice = createSlice({
    name: "message",
    initialState: {
        info: "",
        type: "success",
        open: false
    },
    reducers:{
        setMessage: (state, action) => {
            state.info = action.payload.info;
            state.type = action.payload.type;
            state.open = true;
        },
        close: (state) => {
            state.open = false;
        }
    }
});

export const { setMessage, close } = messageSlice.actions
export default messageSlice.reducer;