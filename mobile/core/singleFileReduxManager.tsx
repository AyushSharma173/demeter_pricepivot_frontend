import { configureStore, createSlice, current } from "@reduxjs/toolkit";



const slice=createSlice({
    initialState:{},
    name:"baseReducer",
    reducers:{
        set(state, {payload}){
            return {...payload}
        },
        update (state,{payload}){
            
            return {...state, ...payload}
        }
    }
})

export function initalizeStore(value:any){

    store.dispatch(slice.actions.set(value))
}

export function updateReduxStore(value:any){
    store.dispatch(slice.actions.update(value))
}

export const store=configureStore({
    reducer:slice.reducer

})

