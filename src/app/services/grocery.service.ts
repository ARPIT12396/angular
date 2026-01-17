import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Grocery } from '../../models/grocery.model';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private dummyGroceries: Grocery[] = [
    { id: 1, name: 'Apples', type: 'fruit' },
    { id: 2, name: 'Bananas', type: 'fruit' },
    { id: 3, name: 'Carrots', type: 'vegetable' },
    { id: 4, name: 'Broccoli', type: 'vegetable' },
    { id: 5, name: 'Milk', type: 'dairy' },
    { id: 6, name: 'Cheese', type: 'dairy' },
    { id: 7, name: 'Bread', type: 'bakery' },
    { id: 8, name: 'Chicken', type: 'meat' }
  ];

  getAll(): Observable<Grocery[]> {
    return of(this.dummyGroceries);
  }

  getByType(type: string): Observable<Grocery[]> {
    const filtered = this.dummyGroceries.filter(grocery => grocery.type === type);
    return of(filtered);
  }

  getById(id: number): Observable<Grocery | undefined> {
    const grocery = this.dummyGroceries.find(g => g.id === id);
    return of(grocery);
  }
}