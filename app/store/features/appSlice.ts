
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

interface AppState {
    user: {
        id: number;
        email: string;
        name: string;
        user_type_id: number;
        team_id: number;
    };
    token: string;
    isLogged: boolean;
    partys: Array<any>;
    usersList: Array<any>;
    productToDelete: {
        open: boolean;
        id: number | null;
    };
}

// Define the initial state using that type

const initialState: AppState = {
    user: {
        id: 0,
        email: '',
        name: '',
        user_type_id: 0,
        team_id: 0,
    },
    token: '',
    isLogged: false,
    partys: [],
    usersList: [],
    productToDelete: {
        open: false,
        id: null
    }
};

// export const getPartys:any = createAsyncThunk('app/getPartys', async () => {
//     const { data } = await axios.get('/api/partys');
//     return data;
// });

export const getUsers:any = createAsyncThunk('app/getUsers', async () => {
    const token = getToken();

    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data;
});


export const appSlice = createSlice({
    name: 'app',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AppState>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLogged = true;
        },
        logout: (state) => {
            state.user = initialState.user;
            state.token = initialState.token;
            state.isLogged = initialState.isLogged;
            localStorage.removeItem('copaUser');
        },
        getUserData: (state) => {
            const data : any = localStorage.getItem('copaUser');

            state.user = JSON.parse(data);

            if (data.id !== 0) {
                state.isLogged = true;
            }
        },
        setProductToDeleteId: (state, action: PayloadAction<any>) => {
            state.productToDelete.id = action.payload;
        },
        setProductToDeleteOpen: (state, action: PayloadAction<boolean>) => {
            state.productToDelete.open = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.usersList = action.payload;
        });
    }
});


export const { login, logout, getUserData, setProductToDeleteId, setProductToDeleteOpen } = appSlice.actions;

export default appSlice.reducer;