import { createReducer, on } from "@ngrx/store";
import { Grocery } from "../../../models/grocery.model";
import { groceryActions } from "../actions/grocery.action";
// const initialState:Grocery[] = [
//     { "id": 1, "name": 'Milk', "type": "dairy" },
//     { "id": 2, "name": 'Bananas' , "type": "fruit" },
//     { "id": 3, "name": 'Lays Chips', "type": "snacks" },      
//     { "id": 4, "name": 'doritos', "type": "snacks" }
// ]
const initialState: Grocery[] = [];


export const groceryReducer = createReducer(initialState,
    on(groceryActions.loadGroceriesSuccess, (state,action) => {
        return action.groceries;
    }),
    on(groceryActions.loadGroceriesFailure, (state, action) => {
        return [];
    })
)