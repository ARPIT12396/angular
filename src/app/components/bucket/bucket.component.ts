import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Bucket } from '../../../models/bucket.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-bucket',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.css']
})
export class BucketComponent {
  private store = inject<Store<{ myBucket: Bucket[] }>>(Store);
  myBucket$: Observable<Bucket[]> = this.store.select('myBucket');

}
