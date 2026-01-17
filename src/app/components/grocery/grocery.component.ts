import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Grocery } from '../../../models/grocery.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addToBucket, removeFromBucket } from '../../store/actions/bucket.action';
import { selectGroceries, selectGroceryByType } from '../../store/selectors/grocery.selector';


@Component({
  selector: 'app-grocery',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.css']
})
export class GroceryComponent implements OnInit {
  private store = inject<Store<{ groceries: Grocery[]}>>(Store);
  groceries$: Observable<Grocery[]> = this.store.select(selectGroceries);
  filteredGroceries$: Observable<Grocery[]> | undefined;

  ngOnInit(): void {
    this.groceries$.subscribe(data => {
      console.log('data2', data);
    });
  }

  onTypeChange(event: Event): void {
    const selectedType = (event.target as HTMLSelectElement).value;
    // TODO: Implement filtering by type via selector if needed
    if(selectedType) this.filteredGroceries$ = this.store.select(selectGroceryByType(selectedType));
    else this.filteredGroceries$ = undefined;
  }

  increment(item: Grocery): void {
     const payload = {
      id: item.id,
      name: item.name,
      quantity: 1
     }
      // this.store.dispatch({type: "Update", payload: payload});
      this.store.dispatch(addToBucket({ payload }));
  }

  decrement(item: Grocery): void {
    const payload = {
      id: item.id,
      name: item.name,
      quantity: -1
     }
     this.store.dispatch(removeFromBucket({ payload }));
  }

}
