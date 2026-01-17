import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroceryComponent } from './components/grocery/grocery.component';
import { BucketComponent } from './components/bucket/bucket.component';
import { Store } from '@ngrx/store';
import { Grocery } from '../models/grocery.model';
import { groceryActions } from './store/actions/grocery.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GroceryComponent, BucketComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private store = inject<Store<{ groceries: Grocery[]}>>(Store);
    // private store = inject<Store<{ groceries: Grocery[]}>>(Store);
    //  groceries$: Observable<Grocery[]> = this.store.select(selectGroceryByType);
   
    ngOnInit(): void {
      this.store.dispatch(groceryActions.loadGroceries());
    }
}
