import { createAction, createActionGroup, emptyProps, props } from "@ngrx/store";
import { Grocery } from "../../../models/grocery.model";



// export const initGroceries = createAction('[Grocery] Init Groceries');

// export const completeGroceries = createAction('[Grocery] Load Groceries success');



export const groceryActions = createActionGroup({
    source: 'Grocery API',
    events: {
        'Load groceries': emptyProps(),
        'Load groceries success': props<{ groceries: Grocery[] }>(),
        'Load groceries failure': emptyProps()

    }
})

