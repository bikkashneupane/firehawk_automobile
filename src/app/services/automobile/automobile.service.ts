import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Automobile } from '../../model/automobile.model';

@Injectable({
  providedIn: 'root',
})
export class AutomobileService {
  constructor(private firestore: Firestore) {}

  getAutomobiles(): Observable<Automobile[]> {
    const automobileCollection = collection(this.firestore, 'automobile');
    return collectionData(automobileCollection, {
      idField: 'id',
    }) as Observable<Automobile[]>;
  }
}
