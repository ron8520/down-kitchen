import { createSlice } from "@reduxjs/toolkit";

/**
 * A global state for saving current login user information
 * @type {Slice<{userInfo: {name: null, description: null, id: null, avatar: null, email: null},
 * {logout: reducers.logout, update: reducers.update, login: reducers.login}, string>}
 */
export const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: {
            "name":null,
            "id": null,
            "email": null,
            "avatar": null,
            "description": null,
        },
    },

    reducers: {
        update: (state, action) => {
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.userInfo.name = null;
            state.userInfo.id = null;
            state.userInfo.email = null;
            state.userInfo.avatar = null;
            state.userInfo.description = null;
        },

    },
});

export const { update, login, logout } = userSlice.actions
export default userSlice.reducer;